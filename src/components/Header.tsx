import { memo } from 'react';
// @ts-ignore
import useFetch from '../hooks/useFetch/useFetch';

const Header = () => {
    const data = useFetch('http://localhost:8080/memory');
    const totalMem = data?.totalMem;

    return (
        <>
        {totalMem && (
                <div>
                    <h3>Total Memory: {totalMem} GB</h3>
                </div>
            )}
        </>
    )
}
export default memo(Header);
