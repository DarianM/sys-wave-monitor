import { memo } from 'react';
// @ts-ignore
import useFetch from '../hooks/useFetch/useFetch';

const Header = () => {
    const data = useFetch('http://localhost:8080/memory');
    const totalMemory = data?.totalMem;
    console.log('data ', data);

    return (
        <>
        {totalMemory && (
                <div>
                    <h3>Total Memory: {totalMemory} GB</h3>
                </div>
            )}
        </>
    )
}
export default memo(Header);
