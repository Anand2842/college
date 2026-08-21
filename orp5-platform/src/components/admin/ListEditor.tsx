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

export function ListEditor({ title, items = [], onUpdate, itemTemplate, renderItemFields }: ListEditorProps) {

    const safeItems = items || [];

    const handleAddItem = () => {
        onUpdate([...safeItems, { ...itemTemplate, id: Date.now().toString() }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...safeItems];
        newItems.splice(index, 1);
        onUpdate(newItems);
    };

    const updateItemField = (index: number, field: string, value: any) => {
        const newItems = safeItems.map((item, i) => i === index ? { ...item, [field]: value } : item);
        onUpdate(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-700">{title}</h3>
                <Button type="button" onClick={handleAddItem} size="sm" variant="outline" className="text-xs border-earth-green/30 text-earth-green hover:bg-earth-green/10">
                    <Plus size={14} className="mr-1" /> Add {title.slice(0, -1)} {/* Crude singularizer */}
                </Button>
            </div>

            <div className="grid gap-4">
                {safeItems.map((item, index) => (
                    <div key={item.id || index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative group shadow-sm hover:border-earth-green/30 transition-all">
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-all"
                            title="Delete Item"
                            aria-label="Delete Item"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                            {renderItemFields(item, index, (field, val) => updateItemField(index, field, val))}
                        </div>
                    </div>
                ))}
                {safeItems.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                        No items added yet. Click &quot;Add {title.slice(0, -1)}&quot; above.
                    </div>
                )}
            </div>
        </div>
    );
}
