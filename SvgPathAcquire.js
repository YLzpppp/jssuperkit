let str = `<svg t="1611900141406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="53260" width="80" height="80"><path d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667zM298.666667 512a213.333333 213.333333 0 0 0 426.666666 0h-85.333333a128 128 0 0 1-256 0H298.666667z" p-id="53261"></path></svg>`;

function getPath() {
    let prefix = '<path d="',
        plen = 9,
        suffix = '" p-id="',
        slen = 8;
    let strlen = str.length;
    let width_i = str.indexOf("width");
    str = str.substr(width_i, strlen - width_i - 1);
    //console.log("修剪后的str 为 : ",str);
    let out = [];
    let round =1;
    while (true) {
        let strlen = str.length;
        let p = str.indexOf(prefix);
        if (p < 0) break; //遍历结束
        let s = str.indexOf(suffix);
        let sub = str.substr(p + plen, s - p - slen - 1); //目标子串
        //console.log("第"+round+"轮中获取到的路径数据: ",sub);
        out.push(sub);
        str = str.substr(s+8, strlen - s);
        //console.log("第"+round+"轮结束后截取的剩余字符串为: ",str);
    }
    console.log(out);
}


getPath();
