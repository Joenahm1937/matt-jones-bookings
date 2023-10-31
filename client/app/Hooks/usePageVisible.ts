import { Dispatch, SetStateAction, useState } from "react";

export const usePageVisible = (): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
] => {
    // Will Initialize to false upon every page render
    const [pageVisible, setPageVisible] = useState(false);

    return [pageVisible, setPageVisible];
};
