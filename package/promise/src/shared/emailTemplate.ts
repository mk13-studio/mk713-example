
export namespace templateService {

    export function prepareUrl(host: string, path: string): string {
        if (host){
            if (host.endsWith('/')) {
                if (path.startsWith('/')) {
                    return host + path.substring(1);
                } else {
                    return host + path;
                }
            } else {
                if (path.startsWith('/')) {
                    return host + path;
                } else {
                    return host + '/' + path;
                }
            }
        } else {
            return path;
        }
    }

    export function prepareEmailTemplate(title: string, message: string[], prominent?: string): string {
        let header = '<html lang="uk"><head><meta name="viewport" content="width=device-width"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>';
        header = header + '<link href="https://fonts.googleapis.com/css2?family=Arsenal:wght@400;700" rel="stylesheet"/><style>';
        header = header + 'body {font-family: "Arsenal", sans-serif;-webkit-font-smoothing: antialiased;margin: 0;padding: 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color:#ffffff}';
        header = header + '.container {width: 100%;text-align: center;display: block;height: auto;}';
        header = header + '.main {width:400px;background-color: #f3f4f5;border: solid 1px #818283;border-radius: 10px;margin:20px;padding:0px;display:inline-block;}';
        header = header + '.title {padding-bottom:30px;}';
        header = header + '.content {padding-left:20px;text-align:left;line-height:200%;color:#818283;}';
        header = header + '.prominent {margin: 100px;margin-top:40px;margin-bottom:10px;padding:10px;padding-bottom:12px;border-radius:10px;background-color:#00a1ff;color:#ffffff;font-size:40px;}';
        header = header + '.description {font-weight: 600;font-size: 18px;letter-spacing: 0.1px;color: #7b8399;line-height: 160%;}';
        header = header + '@media screen and (max-width:400px) {.main{width:100%}}';
        header = header + '</style></head><body>';
        header = header + '<div class="container"><div class="main">';
        
    
        const footer = '</div></div>';

        let data = '';
        message.forEach((line) => {
            if (data !== ''){
                data = data + '<br/>';
            }
            data = data + line;
        });

        let prom = '';

        if (prominent){
            prom = `<div class="prominent">${prominent}</div>`;
        }

        const content = `<h1 class="title">MK713 API Example: ${title}</h1><p class="content">${data}</p>${prom}`;

        return header + content + footer;
    }
}