async function main(ctx, Messege, global) {
    const td = new Messege("3");
    const fd = new Messege("Timer");
    await new Promise((res) => setTimeout(res, 1000));
    td.text = "2";
    await new Promise((res) => setTimeout(res, 1000));
    td.text = "1";
    await new Promise((res) => setTimeout(res, 1000));
    td.text = "0";
    td.ok();
    fd.ok();
    return () => { };
}
// @ts-ignore
return main;
