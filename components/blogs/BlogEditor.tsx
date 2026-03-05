// src/components/BlogEditor.tsx
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'; // icon (cài lucide-react)
import TextAlign from '@tiptap/extension-text-align';


interface BlogEditorProps {
    initialContent?: string;
    onChange?: (html: string) => void;
    maxLength?: number;
}

export default function BlogEditor({
    initialContent = '',
    onChange,
    maxLength = 10000,
}: BlogEditorProps) {
    const [charCount, setCharCount] = useState(0);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                bulletList: { HTMLAttributes: { class: 'blog-ul' } },
                orderedList: { HTMLAttributes: { class: 'blog-ol' } },
            }),
            Placeholder.configure({
                placeholder: 'Bắt đầu viết bài blog của bạn...',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
                defaultAlignment: 'left',
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'blog-editor-content focus:outline-none min-h-[400px] px-6 py-4',
            },
        },
        onUpdate: ({ editor }: any) => {
            const html = editor.getHTML();
            const text = editor.getText();
            setCharCount(text.length);

            if (onChange) {
                onChange(html);
            }


            if (text.length > maxLength) {
                editor.commands.setContent(text.slice(0, maxLength));
            }
        },
    });


    useEffect(() => {
        if (editor) {
            setCharCount(editor.getText().length);
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="blog-editor-container border border-[#DBDDE5] rounded-lg overflow-hidden text-gray-900 bg-white">

            <div className="toolbar flex items-center gap-1 px-4 py-2 bg-white border-[0.5px] border-[#DBDDE5]">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-600' : ''}`}
                    title="Bold"
                >
                    <Bold size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-600' : ''}`}
                    title="Italic"
                >
                    <Italic size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('underline') ? 'bg-gray-600' : ''}`}
                    title="Underline"
                >
                    <UnderlineIcon size={18} />
                </button>

                <div className="w-px h-6 bg-gray-600 mx-2" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-600' : ''}`}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-600' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>

                <div className="w-px h-6 bg-gray-600 mx-2" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-600' : ''}`}
                    title="Align Left"
                >
                    <AlignLeft size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-600' : ''}`}
                    title="Align Center"
                >
                    <AlignCenter size={18} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded hover:bg-gray-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-600' : ''}`}
                    title="Align Right"
                >
                    <AlignRight size={18} />
                </button>
            </div>


            <EditorContent editor={editor} className='bg-white p-[16px]' />


            <div className="px-4 py-2 text-right text-sm text-gray-400 bg-white ">
                {charCount} / {maxLength.toLocaleString()} ký tự
            </div>
        </div>
    );
}