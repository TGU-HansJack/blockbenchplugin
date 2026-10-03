import { createExportCodec } from './codec';
import { QUICK_MESSAGE_DURATION } from './constants';

const DEBUG = false;

/**
 * Exports the selected attachments to the standard Blockbench (.bbmodel) format.
 * @param {Array<Group>} selection - An array of selected attachment groups.
 */
export function exportAttachmentsBB(selection: Group[]) {
    if (!selection || selection.length === 0) {
        Blockbench.showQuickMessage("请至少选择一个要导出的附件。", QUICK_MESSAGE_DURATION);
        return;
    }

    const bb_codec = createExportCodec();
    bb_codec.export(selection);
    
    if (DEBUG) console.log("Exporting selected attachments to .bbmodel format...");
}
