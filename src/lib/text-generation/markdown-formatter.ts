/**
 * Markdown Formatter
 *
 * Converts structured assessment content to markdown format.
 * This separates presentation (markdown) from content generation logic.
 */

import * as FormTypes from '../core/form-types';

/**
 * Format a paragraph node
 */
function formatParagraph(node: FormTypes.ParagraphNode): string {
  return node.text;
}

/**
 * Format a subsection node (#### heading)
 */
function formatSubsection(node: FormTypes.SubsectionNode): string {
  const header = `#### ${node.title}`;
  const content = node.content.map(formatNode).filter(t => t).join('\n\n');
  return content ? `${header}\n\n${content}` : '';
}

/**
 * Format a section node (### heading)
 */
function formatSection(node: FormTypes.SectionNode): string {
  const header = `### ${node.title}`;
  const content = node.content.map(formatNode).filter(t => t).join('\n\n');
  return content ? `${header}\n${content}` : '';
}

/**
 * Format a chapter node (## heading)
 */
function formatChapter(node: FormTypes.ChapterNode): string {
  const header = `## ${node.title}`;
  const content = node.content.map(formatNode).filter(t => t).join('\n\n');
  return content ? `${header}  \n${content}` : '';
}

/**
 * Format a list node (ordered or unordered)
 */
function formatList(node: FormTypes.ListNode): string {
  return node.items.map((item, idx) => {
    if (node.ordered) {
      return `${idx + 1}. ${item}`;
    } else {
      return `- ${item}`;
    }
  }).join('\n');
}

/**
 * Format a line break node
 */
function formatLineBreak(_node: FormTypes.LineBreakNode): string {
  return '\n';
}

/**
 * Format any content node based on its type
 */
function formatNode(node: FormTypes.ContentNode): string {
  switch (node.type) {
    case 'paragraph':
      return formatParagraph(node);
    case 'subsection':
      return formatSubsection(node);
    case 'section':
      return formatSection(node);
    case 'chapter':
      return formatChapter(node);
    case 'list':
      return formatList(node);
    case 'break':
      return formatLineBreak(node);
    default:
      return '';
  }
}

/**
 * Convert structured assessment content to markdown string
 *
 * @param structure The structured assessment content
 * @returns Formatted markdown string
 */
export function formatToMarkdown(structure: FormTypes.AssessmentStructure): string {
  if (!structure.content || structure.content.length === 0) {
    return 'Beginnen Sie mit dem Ausfüllen des Formulars, um eine Vorschau zu sehen...';
  }

  const formatted = structure.content
    .map(formatNode)
    .filter(text => text)
    .join('\n\n');

  return formatted || 'Beginnen Sie mit dem Ausfüllen des Formulars, um eine Vorschau zu sehen...';
}
