import { useState, useEffect, useReducer } from "react";
import InputWithLabel from "./component/InputWithLabel";
import List from "./component/List";

const initialStories = [
    {
        title: "React",
        url: "https://reactjs.org/",
        author: "Jordan Walke",
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: "Redux",
        url: "https://redux.js.org/",
        author: "Dan Abramov, Andrew Clark",
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];

const useStorageState = (key, initialState) => {
    const [value, setValue] = useState(
        localStorage.getItem(key) || initialState
    );

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    if (action.type === "setStories") {
        return action.payload;
    }
    if (action.type === "removeStories") {
        return state.filter(
            (item) => item.objectID !== action.payload.objectID
        );
    }

    throw new Error();
};

const getAsyncStories = () => {
    return Promise.resolve({ data: { stories: initialStories } });
};

function App() {
    const [searchTerm, setSearchTerm] = useStorageState("search", "React");
    const [stories, dispatchStories] = useReducer(storiesReducer, []);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            getAsyncStories()
                .then((result) => {
                    dispatchStories({
                        type: "setStories",
                        payload: result.data.stories,
                    });
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                    setIsError(true);
                });
        }, 1000);
    }, []);
    const handleRemoveStory = (item) => {
        dispatchStories({
            type: "removeStories",
            payload: item,
        });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchedStories = stories.filter((story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={handleSearch}
            >
                <strong>Search:</strong>
            </InputWithLabel>
            {isLoading ? (
                <p>loading...</p>
            ) : (
                <List
                    list={searchedStories}
                    onRemoveItem={handleRemoveStory}
                    isError={isError}
                />
            )}
            <hr />
        </div>
    );
}

export default App;
