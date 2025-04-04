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
    children: CustomText[];
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
    content: string;
    onChange: (value: string) => void;
}

// Définition d'un type complet pour l'éditeur
type SlateEditorType = BaseEditor & ReactEditor & HistoryEditor;

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: 'Zone de saisie pour votre futur article !' }],
    },
];

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

    return (
        <Slate
            editor={editor}
            initialValue={[
                {
                    type: 'paragraph',
                    children: [{ text: content }],
                },
            ]}
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

// Typage restreint pour "format" afin qu'il corresponde aux clés de CustomText (sans "text")
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
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });

    const newProperties = TEXT_ALIGN_TYPES.includes(format)
        ? { align: isActive ? undefined : format }
        : { type: isActive ? 'paragraph' : isList ? 'list-item' : format };

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const isBlockActive = (editor: SlateEditorType, format: any, blockType: keyof CustomElement) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    );

    return !!match;
};

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
