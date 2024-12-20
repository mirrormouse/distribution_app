// components/PreferenceOrderEditor.js
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function PreferenceOrderEditor({ items, onChange }) {
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reordered = Array.from(items);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        onChange(reordered);
    };

    return (
        <div className="bg-background-light p-4 rounded">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="items-droppable" direction="vertical">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                            style={{
                                minHeight: '100px'
                            }}
                        >
                            {items.map((item, index) => (
                                <Draggable
                                    key={item}
                                    draggableId={item}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`bg-background-light p-4 rounded border border-border-light shadow transition 
                      ${snapshot.isDragging ? 'bg-mint-light' : ''}`}
                                        >
                                            <div className="font-semibold mb-2 text-text-light">{index + 1}位:</div>
                                            <div className="text-text-light">{item}</div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
