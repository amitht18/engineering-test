export function debounce(func: any, time: number) {
    let timer: any;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => { func() }, time)
    };
}
