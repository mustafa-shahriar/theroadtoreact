import Item from "./Item";
const List = ({ list, onRemoveItem, isError }) => {
    if (isError) return <li>Something went wrong...</li>;
    if (list.length === 0) {
        return <li>Not item</li>;
    }

    return (
        <ul>
            {list.map((item) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </ul>
    );
};

export default List;
