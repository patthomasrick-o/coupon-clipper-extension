import argparse
import json
import logging
import re
from dataclasses import dataclass, field
from datetime import datetime
from subprocess import check_output
from typing import Any, List, Optional, Tuple, Union

logging.basicConfig(level=logging.INFO)


@dataclass(frozen=True)
class __Args(argparse.Namespace):
    version: str = "1.0.-1"
    previous_rev: Optional[str] = None
    ignore_pattern: str = r"\[skip-ci\]"
    patch_pattern: Optional[str] = None
    minor_pattern: str = r"\+MINOR"
    major_pattern: str = r"\+MAJOR"
    target_branch: Optional[str] = None
    prerelease_pattern: Optional[List[Tuple[str, str]]] = field(default_factory=list)

    json_write: Optional[List[Tuple[str, str]]] = field(default_factory=list)
    string_write: Optional[List[str]] = field(default_factory=list)

    commit: bool = False
    commit_for_prerelease: bool = False
    commit_message: str = "chore(release): [skip-ci] publish version $VERSION"
    commit_push: bool = False

    tag: bool = False
    tag_create_for_prerelease: bool = False
    tag_annotation: str = "v$VERSION"
    tag_message: Optional[str] = None
    tag_push: bool = False
    tag_force_push: bool = False
    tag_push_remote: str = "origin"
    tag_force: bool = False

    branch: bool = False
    branch_create_for_prerelease: bool = False
    branch_format: str = "release/v$VERSION"
    branch_create_patch: bool = False
    branch_create_minor: bool = False
    branch_create_major: bool = False
    branch_push: bool = False
    branch_force_push: bool = False
    branch_remote: str = "origin"
    branch_force: bool = False

    dry_run: bool = False


def dot_get(value: Union[dict, list], path: str) -> Any:
    """Get a value from lists/dicts via a reduced dot path query.

    Args:
        value (Union[dict, list]): Value to get from.
        path (str): Dot path query. Only supports accessing attributes and indices, no complex behavior.

    Returns:
        Any: Value stored at path if exists.
    """

    split_path = re.split(r"(\.|\[\d+\]\.?)", path)

    current = value

    for path_part in split_path:
        path_part = path_part.strip(".")

        if path_part == "":
            continue

        index_match = re.match(r"^\[([0-9]+)\]$", path_part)
        if index_match:
            index = index_match.group(1)
            current = current[int(index)]
        elif isinstance(current, dict):
            current = current.get(path_part, None)
        else:
            raise ValueError("dot_get: Couldn't find key %s in %s", path_part, current)

    return current


def dot_set(
    value: Union[dict, list], path: str, value_to_set: Any
) -> Union[dict, list]:
    """Set a value at a dot path

    Args:
        value (Union[dict, list]): Value to get from.
        path (str): Dot path query. Only supports accessing attributes and indices, no complex behavior.
        value_to_set (Any): Value to set in the object.

    Returns:
        Union[dict, list]: Modified object.
    """

    split_path = re.split(r"(\.|\[\d+\]\.?)", path)

    current = value

    for i, path_part in enumerate(split_path):
        is_last = i == len(split_path) - 1

        path_part = path_part.strip(".")

        if path_part == "":
            continue

        index_match = re.match(r"^\[([0-9]+)\]$", path_part)
        if index_match:
            if not is_last:
                index = index_match.group(1)
                current = current[int(index)]
            else:
                current[int(index)] = value_to_set
        elif isinstance(current, dict):
            if not is_last:
                current = current.get(path_part, None)
            else:
                current[path_part] = value_to_set
        else:
            raise ValueError("dot_set: Couldn't find key %s in %s", path_part, current)

    return current


def get_git_commit_date(ref: str) -> datetime:
    """For a commit hash, get the date it was committed.

    The datetime is returned in UTC only.

    Args:
        ref (str): Commit SHA / hash.

    Returns:
        datetime: Datetime of commit in UTC.
    """

    cmd = ["git", "show", "--no-patch", r"--format=%ct", ref]
    output = check_output(cmd).decode("utf-8").strip()
    return datetime.fromtimestamp(int(output))


def fmt_version(version: Tuple[int, int, int]) -> str:
    """Format a version tuple to a string.

    Args:
        version (Tuple[int, int, int]): Version tuple, like `(1, 2, 3)`.

    Returns:
        str: Formatted version, like `"1.2.3"`.
    """

    return ".".join([str(i) for i in version])


def create_git_commit(version: str, updated_files: List[str], args: __Args):
    logging.info("Creating git commit for version %s", version)

    # Add files.
    logging.info(f"Adding files to commit {updated_files=}")
    cmd = ["git", "add", *updated_files]
    check_output(cmd)

    # Create commit.
    commit_msg = args.commit_message.replace("$VERSION", version)
    cmd = ["git", "commit", "-m", commit_msg]
    check_output(cmd)

    if args.commit_push and not args.commit_for_prerelease:
        logging.info(f"Pushing release commit since {args.commit_push=}")
        cmd = ["git", "push"]
        check_output(cmd)
    else:
        logging.info(f"Not pushing tags since {args.commit_push=}")


def create_git_tags(version: str, args: __Args) -> List[str]:
    logging.info("Creating git tags for version %s", version)

    tags: List[str] = []

    cmd = ["git", "tag"]

    tag_annotation = args.tag_annotation.replace("$VERSION", version)
    tags.append(tag_annotation)
    cmd.extend(["-a", tag_annotation])

    tag_message = args.tag_message if args.tag_message else ""
    cmd.extend(["-m", tag_message])

    if args.tag_force:
        cmd.append("--force")

    check_output(cmd)

    logging.info(f"Created git tags {tags=}")

    if args.tag_push:
        logging.info(f"Pushing git tags to remote {args.tag_push_remote=}")
        cmd = ["git", "push", args.tag_push_remote, "--tags"]
        if args.tag_force_push:
            logging.info("Force pushing tags to remote")
            cmd.append("--force")
        check_output(cmd)
        logging.info("Pushed tags to remote")
    else:
        logging.info(f"Not pushing tags since {args.tag_push=}")

    return tags


def __create_git_branch(branch: str, force: bool = False):
    logging.info(f"Creating git branch {branch=} {force=}")

    cmd = ["git", "branch", "--create"]
    if force:
        cmd.append("--force")
    cmd.append(branch)

    check_output(cmd)


def create_git_branches(version: str, args: __Args) -> List[str]:
    logging.info(f"Creating git branches for {version=}")

    branches: List[str] = []

    v_major, v_minor, _ = version.split(".")

    if args.branch_create_patch:
        branch_name = args.branch_format.replace("$VERSION", version)
        __create_git_branch(branch_name, args.branch_force)
        branches.append(branch_name)
    if args.branch_create_minor:
        wildcard_version = f"{v_major}.{v_minor}"
        branch_name = args.branch_format.replace("$VERSION", wildcard_version)
        __create_git_branch(branch_name, args.branch_force)
        branches.append(branch_name)
    if args.branch_create_major:
        wildcard_version = f"{v_major}"
        branch_name = args.branch_format.replace("$VERSION", wildcard_version)
        __create_git_branch(branch_name, args.branch_force)
        branches.append(branch_name)

    logging.info(f"Created git branches {branches=}")

    if branches and args.branch_push:
        logging.info("Pushing git branches to remote")
        if args.branch_force_push:
            logging.info("Force pushing tags to remote")
        for branch in branches:
            cmd = ["git", "push", args.branch_remote, branch]
            if args.branch_force_push:
                cmd.append("--force")
            check_output(cmd)
            logging.info(f"Pushed {branch=} to remote")
    elif not args.branch_push:
        logging.info(f"Not pushing tags since {args.tag_push=}")
    else:
        logging.info(f"Not pushing tags since {branches=}")

    return branches


def main(args: __Args):
    """Main function.

    Args:
        args (argparse.Namespace): Arguments.
    """

    logging.info("ptsemrelease.py")

    version_list = [int(s) for s in args.version.strip().split(".")]
    version: Tuple[int, int, int] = (version_list[0], version_list[1], version_list[2])
    next_version = fmt_version(version)

    # Determine if this is a prerelease.
    target_branch = args.target_branch
    if not target_branch:
        target_branch = (
            check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"])
            .decode("utf-8")
            .strip()
        )
    version_label = ""
    if args.prerelease_pattern:
        for pattern, suffix in args.prerelease_pattern:
            if re.match(pattern, target_branch):
                version_label = f"-{suffix}"
                break

    ignore_pattern = re.compile(args.ignore_pattern) if args.ignore_pattern else None
    patch_pattern = re.compile(args.patch_pattern) if args.patch_pattern else None
    minor_pattern = re.compile(args.minor_pattern) if args.minor_pattern else None
    major_pattern = re.compile(args.major_pattern) if args.major_pattern else None

    # Run git to get all previous commit messages.
    cmd = ["git", "log", "--pretty=oneline"]
    if args.previous_rev:  # If previous revision is provided
        cmd.append(f"{args.previous_rev}..HEAD")
    cmd_output = check_output(cmd).decode("utf-8").strip()
    if not cmd_output:
        return

    commit_messages = cmd_output.split("\n")
    commit_messages.reverse()

    for i, msg in enumerate(commit_messages):
        ref, commit_message = msg.split(" ", 1)

        if ignore_pattern and ignore_pattern.search(msg):
            logging.info(
                "i=%s, ref=%s, date=%s, version=%s, incremented: %s -> ignored; matched ignore pattern"
                % (
                    i,
                    ref,
                    get_git_commit_date(ref),
                    next_version,
                    commit_message,
                )
            )
            continue
        elif major_pattern and major_pattern.search(msg):
            version = (version[0] + 1, 0, 0)
        elif minor_pattern and minor_pattern.search(msg):
            version = (version[0], version[1] + 1, 0)
        elif patch_pattern and patch_pattern.search(msg):
            version = (version[0], version[1], version[2] + 1)
        elif not patch_pattern:
            version = (version[0], version[1], version[2] + 1)

        next_version = fmt_version(version)
        logging.info(
            "i=%s, ref=%s, date=%s, version=%s, incremented: %s"
            % (
                i,
                ref,
                get_git_commit_date(ref),
                next_version,
                commit_message,
            )
        )

    logging.info("version=%s" % (next_version))

    updated_files: List[str] = []

    # Write to JSON files.
    if args.json_write and not args.dry_run:
        for json_file, dot_path in args.json_write:
            logging.info(
                'Writing version=%s to JSON file "%s" at path "%s"'
                % (next_version, json_file, dot_path)
            )

            with open(json_file, "rb") as f:
                data = json.load(f)

            dot_set(data, dot_path, next_version)

            with open(json_file, "w", encoding="utf8") as f:
                json.dump(data, f, indent=2)

            updated_files.append(json_file)

    # Write to string files.
    if args.string_write and not args.dry_run:
        for string_file in args.string_write:
            logging.info(
                'Writing version=%s to file "%s"' % (next_version, string_file)
            )

            with open(string_file[0], "w", encoding="utf8") as f:
                f.write(next_version + "\n")

            updated_files.append(string_file[0])

    if args.commit and not args.commit_for_prerelease and version_label:
        logging.info(
            f"Skipping commit since {args.commit_for_prerelease=} and {version_label=}"
        )
    elif args.commit:
        create_git_commit(f"{next_version}{version_label}", updated_files, args)

    if args.tag and not args.tag_create_for_prerelease and version_label:
        logging.info(
            f"Skipping tag creation since {args.tag_create_for_prerelease=} and {version_label=}"
        )
    elif args.tag:
        create_git_tags(f"{next_version}{version_label}", args)

    if args.branch and not args.branch_create_for_prerelease and version_label:
        logging.info(
            f"Skipping branch creation since {args.branch_create_for_prerelease=} and {version_label=}"
        )
    elif args.branch:
        create_git_branches(f"{next_version}{version_label}", args)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PT semantic release script")
    parser.add_argument(
        "-v",
        "--version",
        help="Current version",
        type=str,
        default="1.0.-1",
    )
    parser.add_argument(
        "--previous-rev",
        help="Previous revision",
        type=str,
    )
    parser.add_argument(
        "--ignore-pattern",
        help="Regex pattern, if matched in a commit message, will be ignored.",
        type=str,
        default=r"\[skip-ci\]",
    )
    parser.add_argument(
        "--patch-pattern",
        help="Regex pattern, if matched in a commit message, will increment"
        + "patch number. If empty, will default to every non-matching message.",
        type=str,
    )
    parser.add_argument(
        "--minor-pattern",
        help="Regex pattern, if matched in a commit message, will increment minor number.",
        type=str,
        default=r"\+MINOR",
    )
    parser.add_argument(
        "--major-pattern",
        help="Regex pattern, if matched in a commit message, will increment major number.",
        type=str,
        default=r"\+MAJOR",
    )
    parser.add_argument(
        "--target-branch",
        type=str,
        help="If specified, this is the target branch to merge into. Used with --prerelease-pattern.",
    )
    parser.add_argument(
        "--prerelease-pattern",
        action="append",
        nargs=2,
        help="Pair of regex pattern to match against branches, and suffix to add to version for prerelease.",
    )

    # ##########################################
    # Output
    # ##########################################

    parser.add_argument(
        "--json-write",
        action="append",
        nargs=2,
        help="Pairs of JSON file, dot path to location to write new version",
    )
    parser.add_argument(
        "--string-write",
        action="append",
        nargs=1,
        help="A path to a file whose contents will get replaced with the version number.",
    )

    # ##########################################
    # Commit
    # ##########################################

    parser.add_argument(
        "--commit",
        action="store_true",
        default=False,
        help="If true, create a git commit.",
    )
    parser.add_argument(
        "--commit-for-prerelease",
        action="store_true",
        default=False,
        help="If true and a prerelease tag exists, do not create a commit.",
    )
    parser.add_argument(
        "--commit-message",
        action="store_true",
        default="chore(release): [skip-ci] publish version $VERSION",
        help="If true, use this message instead of the default. $VERSION gets substituted for the full version string.",
    )
    parser.add_argument(
        "--commit-push",
        action="store_true",
        default=False,
        help="If true, push to origin after commiting.",
    )

    # ##########################################
    # Tag
    # ##########################################

    parser.add_argument(
        "--tag",
        action="store_true",
        default=False,
        help="If true, create a git tag.",
    )
    parser.add_argument(
        "--tag-create-for-prerelease",
        action="store_true",
        default=False,
        help="If true and a prerelease tag exists, do not create release tags.",
    )
    parser.add_argument(
        "--tag-annotation",
        type=str,
        default="v$VERSION",
        help="Annotation for the tag. $VERSION gets substituted for the full version string.",
    )
    parser.add_argument(
        "--tag-message",
        type=str,
        default=None,
        help="Message to use for the tag.",
    )
    parser.add_argument(
        "--tag-push",
        action="store_true",
        default=False,
        help="If true, push the tag to origin.",
    )
    parser.add_argument(
        "--tag-force-push",
        action="store_true",
        default=False,
        help="If true, force push the tag to origin.",
    )
    parser.add_argument(
        "--tag-push-remote",
        type=str,
        default="origin",
        help="The remote to push the tag to. Defaults to origin.",
    )
    parser.add_argument(
        "--tag-force",
        action="store_true",
        default=False,
        help="If true and a tag for this already exists, overwrite it.",
    )

    # ##########################################
    # Branch
    # ##########################################

    parser.add_argument(
        "--branch",
        action="store_true",
        default=False,
        help="If true, create release branches.",
    )
    parser.add_argument(
        "--branch-create-for-prerelease",
        action="store_true",
        default=False,
        help="If true and a prerelease tag exists, do not create release branches.",
    )
    parser.add_argument(
        "--branch-format",
        type=str,
        default="release/v$VERSION",
        help="The format of the branch name. $VERSION will be replaced with the version number.",
    )
    parser.add_argument(
        "--branch-create-patch",
        action="store_true",
        default=False,
        help="If true, create release branches for patch releases like 2.0.1",
    )
    parser.add_argument(
        "--branch-create-minor",
        action="store_true",
        default=False,
        help="If true, create release branches for minor releases like 2.0",
    )
    parser.add_argument(
        "--branch-create-major",
        action="store_true",
        default=False,
        help="If true, create release branches for major releases like 2",
    )
    parser.add_argument(
        "--branch-push",
        action="store_true",
        default=False,
        help="If true, push the branch to the remote. Defaults to false.",
    )
    parser.add_argument(
        "--branch-force-push",
        action="store_true",
        default=False,
        help="If true, force push the branch to the remote. Defaults to false.",
    )
    parser.add_argument(
        "--branch-remote",
        type=str,
        default="origin",
        help="The remote to create the branch on. Defaults to origin.",
    )
    parser.add_argument(
        "--branch-force",
        action="store_true",
        default=False,
        help="If true, force branch creation even if the branch already exists. This is useful when you want to create a new release branch from an existing one.",
    )

    # ##########################################
    # Other
    # ##########################################

    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="If true, do not modify files.",
    )

    args = parser.parse_args()
    args = __Args(**vars(args))
    main(args)
