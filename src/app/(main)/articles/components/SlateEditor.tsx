import React, { useMemo, useCallback } from 'react';
import {
    createEditor,
    Editor,
    Transforms,
    Element as SlateElement,
    Descendant,
    BaseEditor,
    Text
} from 'slate';
import {
    Slate,
    Editable,
    withReact,
    useSlate,
    ReactEditor,
    RenderElementProps,
    RenderLeafProps
} from 'slate-react';
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdFormatAlignLeft,
    MdFormatAlignCenter,
    MdFormatAlignRight,
    MdFormatAlignJustify,
    MdFormatQuote
} from 'react-icons/md';
import { HistoryEditor, withHistory } from 'slate-history';

type CustomElement = {
    type:
    | 'paragraph'
    | 'heading-one'
    | 'heading-two'
    | 'block-quote'
    | 'list-item'
    | 'bulleted-list'
    | 'numbered-list';
    align?: string;
    children: Descendant[];
};

type CustomText = { text: string; bold?: true; italic?: true; underline?: true };

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

interface SlateEditorProps {
    content: string; // contenu HTML initial
    onChange: (value: string) => void; // onChange renvoie le HTML
}

type SlateEditorType = BaseEditor & ReactEditor & HistoryEditor;

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

// Valeur par défaut pour l'éditeur
const defaultValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: 'Zone de saisie pour votre futur article !' }],
    },
];

// Fonction de sérialisation pour convertir la valeur Slate en HTML
const serialize = (node: Descendant): string => {
    if (Text.isText(node)) {
        let string = node.text;
        if (node.bold) {
            string = `<strong>${string}</strong>`;
        }
        if (node.italic) {
            string = `<em>${string}</em>`;
        }
        if (node.underline) {
            string = `<u>${string}</u>`;
        }
        return string;
    }

    const alignStyle =
        (node as SlateElement & { align?: string }).align
            ? ` style="text-align: ${(node as SlateElement & { align?: string }).align};"`
            : '';

    const children = node.children.map(n => serialize(n)).join('');

    switch (node.type) {
        case 'heading-one':
            return `<h1${alignStyle}>${children}</h1>`;
        case 'heading-two':
            return `<h2${alignStyle}>${children}</h2>`;
        case 'block-quote':
            return `<blockquote${alignStyle} class='before:content-["❝"] before:pr-1 before:text-2xl before:font-semibold after:content-["❞"] after:pl-1 after:text-2xl after:font-semibold'>${children}</blockquote>`;
        case 'list-item':
            return `<li${alignStyle}>${children}</li>`;
        case 'bulleted-list':
            return `<ul class="list-disc ml-5"${alignStyle}>${children}</ul>`;
        case 'numbered-list':
            return `<ol class="list-decimal ml-5"${alignStyle}>${children}</ol>`;
        default:
            return `<p${alignStyle}>${children}</p>`;
    }
};

// Fonction de désérialisation simple : elle convertit du HTML en nœuds Slate
const deserialize = (html: string): Descendant[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    const traverse = (node: ChildNode): Descendant[] => {
        let results: Descendant[] = [];
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                results.push({ text: child.textContent || '' });
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const element = child as HTMLElement;
                let children = traverse(element);
                if (children.length === 0) {
                    children = [{ text: '' }];
                }

                switch (element.tagName.toLowerCase()) {
                    case 'strong':
                        children = children.map(child => ({ ...child, bold: true }));
                        results = results.concat(children);
                        break;
                    case 'em':
                        children = children.map(child => ({ ...child, italic: true }));
                        results = results.concat(children);
                        break;
                    case 'u':
                        children = children.map(child => ({ ...child, underline: true }));
                        results = results.concat(children);
                        break;
                    case 'h1':
                        results.push({ type: 'heading-one', children: children } as CustomElement);
                        break;
                    case 'h2':
                        results.push({ type: 'heading-two', children: children } as CustomElement);
                        break;
                    case 'blockquote':
                        results.push({ type: 'block-quote', children: children } as CustomElement);
                        break;
                    case 'li':
                        results.push({ type: 'list-item', children: children } as CustomElement);
                        break;
                    case 'ul':
                        results.push({ type: 'bulleted-list', children: children } as CustomElement);
                        break;
                    case 'ol':
                        results.push({ type: 'numbered-list', children: children } as CustomElement);
                        break;
                    case 'p':
                    default:
                        results.push({ type: 'paragraph', children: children } as CustomElement);
                        break;
                }
            }
        });
        return results;
    };

    return traverse(body);
};

const SlateEditor: React.FC<SlateEditorProps> = ({ content, onChange }) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    );
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    );
    const editor = useMemo(() => withHistory(withReact(createEditor())), []) as SlateEditorType;

    // Si le contenu initial est au format HTML, on le désérialise en nœuds Slate.
    const initialValue = useMemo(() => {
        try {
            const parsed = deserialize(content);
            return parsed.length > 0 ? parsed : defaultValue;
        } catch (error) {
            return [{ type: 'paragraph', children: [{ text: content }] } as CustomElement];
        }
    }, [content]);

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(value) => {
                const html = value.map(node => serialize(node)).join('');
                onChange(html);
            }}
        >
            <div className="flex gap-2 my-2">
                <BlockButton format="heading-one" icon="H1" />
                <BlockButton format="heading-two" icon="H2" />
                <MarkButton format="bold" icon={<MdFormatBold />} />
                <MarkButton format="italic" icon={<MdFormatItalic />} />
                <MarkButton format="underline" icon={<MdFormatUnderlined />} />
                <BlockButton format="block-quote" icon={<MdFormatQuote />} />
                <BlockButton format="bulleted-list" icon={<MdFormatListBulleted />} />
                <BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
                <BlockButton format="left" icon={<MdFormatAlignLeft />} />
                <BlockButton format="center" icon={<MdFormatAlignCenter />} />
                <BlockButton format="right" icon={<MdFormatAlignRight />} />
                <BlockButton format="justify" icon={<MdFormatAlignJustify />} />
            </div>
            <hr className="mb-6" />
            <Editable
                className="bg-tertiary-black p-4 rounded"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Zone de saisie pour votre futur article !"
                spellCheck
                autoFocus
            />
        </Slate>
    );
};

// Fonctions de bascule pour les marques (gras, italique, souligné)
const toggleMark = (
    editor: SlateEditorType,
    format: keyof Omit<CustomText, "text">
) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isMarkActive = (
    editor: SlateEditorType,
    format: keyof Omit<CustomText, "text">
): boolean => {
    const marks = Editor.marks(editor) as Partial<Omit<CustomText, "text">> | null;
    return marks ? marks[format] === true : false;
};

const toggleBlock = (editor: SlateEditorType, format: any) => {
    // Vérifie si un alignement ou un type de bloc est déjà actif dans la sélection
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format);

    // Si la sélection se trouve dans une liste, on la déballe pour éviter des effets inattendus
    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });

    // Définit les nouvelles propriétés à appliquer :
    // Pour l'alignement, on met { align: format } (ou on le retire si déjà actif)
    // Sinon, on choisit un nouveau type de bloc
    const newProperties = TEXT_ALIGN_TYPES.includes(format)
        ? { align: isActive ? undefined : format }
        : { type: isActive ? "paragraph" : isList ? "list-item" : format };

    // Appliquer les propriétés à tous les nœuds bloc dans la sélection
    Transforms.setNodes(editor, newProperties, {
        at: editor.selection!,
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        split: true, // On force le fractionnement pour que chaque bloc soit isolé
    });

    // Si le format correspond à un type de liste et que ce n'est pas actif, on enveloppe les nœuds
    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const isBlockActive = (
    editor: SlateEditorType,
    format: any,
    blockType: keyof CustomElement
) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                SlateElement.isElement(n) && (n as CustomElement)[blockType] === format,
        })
    );
    return !!match;
};

// Composant de rendu des éléments
const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote
                    style={style}
                    {...attributes}
                    className='before:content-["❝"] before:pr-1 before:text-2xl before:font-semibold after:content-["❞"] after:pl-1 after:text-2xl after:font-semibold'
                >
                    <span className='bg-gray-100 p-2 rounded'>{children}</span>
                </blockquote>
            );
        case 'heading-one':
            return (
                <h1 style={style} {...attributes} className='font-extrabold text-3xl'>
                    {children}
                </h1>
            );
        case 'heading-two':
            return (
                <h2 style={style} {...attributes} className='font-semibold text-xl'>
                    {children}
                </h2>
            );
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes} className='list-disc ml-5'>
                    {children}
                </ul>
            );
        case 'numbered-list':
            return (
                <ol style={style} {...attributes} className='list-decimal ml-5'>
                    {children}
                </ol>
            );
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

// Composant de rendu des feuilles (gestion des marques)
const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
};

// Bouton de bloc dans la barre d'outils
const BlockButton = ({ format, icon }: { format: any; icon: any }) => {
    const editor = useSlate() as SlateEditorType;
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    );
    return (
        <button
            className={`p-2 text-xl rounded mx-1 ${isActive ? 'bg-tertiary-black' : ''}`}
            onMouseDown={event => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            {icon}
        </button>
    );
};

// Bouton de marque dans la barre d'outils
const MarkButton = ({ format, icon }: { format: keyof Omit<CustomText, "text">; icon: any }) => {
    const editor = useSlate() as SlateEditorType;
    const isActive = isMarkActive(editor, format);
    return (
        <button
            className={`p-2 text-xl rounded mx-1 ${isActive ? 'bg-tertiary-black' : ''}`}
            onMouseDown={event => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            {icon}
        </button>
    );
};

export default SlateEditor;