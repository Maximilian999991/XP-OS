async function main(ctx, Messege, global) {
    const fd = new Messege("File System");
    const stream = await navigator.storage.getDirectory();
    const isPersisted = await navigator.storage.persist();
    if (!isPersisted) {
        fd.error("Storage must first be persisted.");
        throw new Error("Storage must first be persisted.");
    }
    async function writeFile(path, content) {
        const fileHandle = await stream.getFileHandle(path, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    }
    async function readFile(path) {
        const fileHandle = await stream.getFileHandle(path);
        const file = await fileHandle.getFile();
        const content = await file.text();
        return content;
    }
    async function createFolder(path) {
        await stream.getDirectoryHandle(path, { create: true });
    }
    async function listFolder(path) {
        const folder = path === "" ? stream : await stream.getDirectoryHandle(path);
        const entries = [];
        for await (const [name, handle] of folder.entries()) {
            entries.push({
                name: name,
                kind: handle.kind,
            });
        }
        return entries;
    }
    async function removeFolder(path, recursive = false) {
        await stream.removeEntry(path, { recursive });
    }
    global.set("file", {
        writeFile,
        readFile,
        createFolder,
        listFolder,
        removeFolder,
    });
    fd.ok();
    return () => { };
}
// @ts-ignore
return main;
