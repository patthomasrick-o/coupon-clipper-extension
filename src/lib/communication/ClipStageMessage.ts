import ClipStageEnum from "./ClipStageEnum";

/** A message about the current clipping stage. */
export default class ClipStageMessage {
  MSG_TYPE = "CLIP_STAGE_MSG";

  stage: ClipStageEnum;

  /** Creates a new ClipProgressMessage. */
  constructor(msg: Partial<ClipStageMessage>) {
    this.stage = msg.stage ?? ClipStageEnum.STARTING;
  }
}
