import { Button } from "@/components/atoms/Button";
import { Trash2, Plus } from "lucide-react";
import { AdminInput } from "./AdminInput";

interface ListEditorProps {
    title: string;
    items: any[];
    onUpdate: (newItems: any[]) => void;
    itemTemplate: any; // The structure of a new item
    renderItemFields: (item: any, index: number, updateItem: (field: string, val: any) => void) => React.ReactNode;
}

export function ListEditor({ title, items, onUpdate, itemTemplate, renderItemFields }: ListEditorProps) {

    const handleAddItem = () => {
        onUpdate([...items, { ...itemTemplate, id: Date.now().toString() }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onUpdate(newItems);
    };

    const updateItemField = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-700">{title}</h3>
                <Button onClick={handleAddItem} size="sm" variant="outline" className="text-xs">
                    <Plus size={14} className="mr-1" /> Add {title.slice(0, -1)} {/* Crude singularizer */}
                </Button>
            </div>

            <div className="grid gap-4">
                {items.map((item, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group">
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Item"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
                            {renderItemFields(item, index, (field, val) => updateItemField(index, field, val))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
