import { QUICK_MESSAGE_DURATION } from './constants';
import { isAttachment } from './discovery';

/**
 * Recursively collects all attachment elements (those with clothingSlot) from a node and its children.
 * @param element The element to traverse
 * @param rootElements Set of root elements to exclude from deletion
 * @returns Array of all attachment elements found (excluding root elements)
 */
function collectAttachmentElements(element: any, rootElements: Set<any>): any[] {
    const attachments: any[] = [];
    
    function traverse(node: any) {
        // Skip if this is a root element (should be preserved)
        if (rootElements.has(node)) {
            // Still traverse children to find nested attachments
            if (node instanceof Group && node.children) {
                node.children.forEach(traverse);
            }
            return;
        }
        
        if (isAttachment(node)) {
            attachments.push(node);
        }
        
        // Continue traversing children
        if (node instanceof Group && node.children) {
            node.children.forEach(traverse);
        }
    }
    
    traverse(element);
    return attachments;
}

/**
 * Identifies root attachment groups - the first level groups with clothingSlot that are children of base model groups.
 * @param elements Array of top-level attachment elements
 * @returns Set of root attachment groups to preserve
 */
function identifyRootAttachmentGroups(elements: any[]): Set<any> {
    const rootGroups = new Set<any>();
    
    elements.forEach(element => {
        // If this element has a clothingSlot and its parent doesn't have a clothingSlot,
        // it's a root attachment group that should be preserved
        if (isAttachment(element)) {
            const parent = element.parent;
            if (!parent || !isAttachment(parent)) {
                // This is a root attachment group - preserve it
                rootGroups.add(element);
            }
        }
    });
    
    return rootGroups;
}

/**
 * Delete (-) Root: Deletes attachment elements but preserves root attachment groups and base model groups.
 * @param {Array<Group|Cube>} elements - An array of attachment groups/elements in the section to be deleted.
 */
export function deleteSectionSafe(elements: any[]) {
    if (!elements || elements.length === 0) {
        Blockbench.showQuickMessage("此槽位没有可删除的附件。", QUICK_MESSAGE_DURATION);
        return;
    }

    Undo.initEdit({ outliner: true }, `删除附件并保留根组`);

    // Identify root attachment groups (first level with clothingSlot) that should be preserved
    const rootGroups = identifyRootAttachmentGroups(elements);

    // Collect all attachment elements (those with clothingSlot), excluding root groups
    const allAttachments = new Set<any>();
    elements.forEach(element => {
        const attachments = collectAttachmentElements(element, rootGroups);
        attachments.forEach(att => allAttachments.add(att));
    });

    if (allAttachments.size === 0) {
        Undo.finishEdit('删除附件');
        Blockbench.showQuickMessage("没有找到可删除的附件元素。", QUICK_MESSAGE_DURATION);
        return;
    }

    // Delete only the nested attachment elements, preserving:
    // 1. Base model groups (no clothingSlot)
    // 2. Root attachment groups (first level with clothingSlot)
    allAttachments.forEach(attachment => {
        // Delete the attachment element - root groups and base model groups are preserved
        attachment.remove();
    });

    Undo.finishEdit(`删除 ${allAttachments.size} 个附件并保留根组`);
    
    Blockbench.dispatchEvent('attachments_changed', {});
    Blockbench.showQuickMessage(`已删除 ${allAttachments.size} 个附件，根组已保留`, QUICK_MESSAGE_DURATION);
}

/**
 * Deletes all attachments within a given section (original behavior - deletes everything including parent groups).
 * @param {Array<Group|Cube>} elements - An array of attachment groups/elements in the section to be deleted.
 */
export function deleteSection(elements: any[]) {
    if (!elements || elements.length === 0) {
        Blockbench.showQuickMessage("此槽位没有可删除的附件。", QUICK_MESSAGE_DURATION);
        return;
    }

    // Confirmation is handled in panel.ts confirmDelete method
    Undo.initEdit({ outliner: true }, `删除 ${elements.length} 个附件`);

    // The 'elements' array from the panel is the definitive list of top-level attachments for this section.
    // Blockbench's .remove() method handles removing children automatically, regardless of their properties.
    elements.forEach(element => element.remove());

    Undo.finishEdit(`删除 ${elements.length} 个附件`);
    
    Blockbench.dispatchEvent('attachments_changed', {});
    Blockbench.showQuickMessage(`已删除 ${elements.length} 个附件`, QUICK_MESSAGE_DURATION);
}
