export function debounce(func: any, time: number) {
    let timer: NodeJS.Timeout;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => { func() }, time)
    };
}
