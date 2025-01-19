/** A message that is sent to the background script to update the progress of the clipper popup. */
export default class ClipProgressMessage {
  MSG_TYPE = "CLIP_PROGRESS_MSG";

  numClipped: number;

  numTotal: number;

  /** Creates a new ClipProgressMessage. */
  constructor(msg: Partial<ClipProgressMessage>) {
    this.numClipped = msg.numClipped ?? 0;
    this.numTotal = msg.numTotal ?? 0;
  }
}
