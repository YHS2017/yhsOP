import uuid from "uuid-js";

export function buildProject(outline, content) {
    try {
        // const script = {};
        const in_roles = content.roles;
        const in_galleries = content.galleries;
        const in_paragraphs = content.paragraphs;
        const in_numbers = content.numbers;
        const out_roles = in_roles.map(r => ({ ...r, gallery_ids: [] }));
        const out_galleries = in_galleries.map(g => ({ ...g, items: [] }));
        const out_paragraphs = [];

        function getRoleIdByName(name) {
            switch (name) {
                case '我':
                    return 0;
                default:
                    return (out_roles.find(r => r.name === name)).id;
            }
        }

        function getGalleryById(id) {
            return out_galleries.find(g => g.id === id);
        }

        function getGalleryByTitle(title) {
            return out_galleries.find(g => g.title === title);
        }

        function getGalleryIdByTitle(title) {
            return out_galleries.find(g => g.title === title).id;
        }

        function addToGallery(title, item) {
            const gallery = getGalleryByTitle(title);
            const items = gallery.items;
            // 如果不存在相同的item才需要增加到items中
            switch (item.type) {
                case 'GalleryItemImage': {
                    if (!gallery.items.find(i => i.image === item.image)) {
                        items.push(item);
                    }
                    break;
                }

                case 'GalleryItemVideo': {
                    if (!gallery.items.find(i => i.video === item.video)) {
                        items.push(item);
                    }
                    break;
                }

                case 'GalleryItemAudio': {
                    if (!gallery.items.find(i => i.audio === item.audio)) {
                        items.push(item);
                    }
                    break;
                }

                case 'GalleryItemCall': {
                    if (!gallery.items.find(i => i.title === item.title)) {
                        items.push(item);
                    }
                    break;
                }

                case 'GalleryItemEnding': {
                    if (!gallery.items.find(i => i.title === item.title)) {
                        items.push(item);
                    }
                    break;
                }

                default:
                    break;
            }
        }

        function trimParagraphText(text) {
            // 移除首尾的多余空行和空格
            return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
        }

        function buildCallNode(blocks, i) {
            const call = { type: 'Call', lines: [] };
            const first_lines = blocks[i].split(/\n/);
            call.role_id = getRoleIdByName(first_lines[0].substring(1).trim());
            call.title = first_lines[2].trim();
            call.image = first_lines[3].trim();

            while (true) {
                i++;

                const lines = blocks[i].split(/\n/);
                if (lines[0].startsWith('#电话结束#')) {
                    break;
                }
                else {
                    const role_id = getRoleIdByName(lines[0].substring(1).trim());
                    const text = lines[1].trim();
                    const audio = lines[2] ? lines[2].trim() : undefined;
                    call.lines.push({ role_id, text, audio });
                }
            }

            if (first_lines[4]) {
                const gallery_title = first_lines[4].substring(1).trim();
                addToGallery(gallery_title, { ...call , type: 'GalleryItemCall' });
                call.gallery_id = getGalleryIdByTitle(gallery_title);
            }

            return { call, block_index: i };
        }

        function buildParagraphText(text) {
            const nodes = [];
            const trimmed_text = trimParagraphText(text);
            const blocks = trimmed_text.split(/\n[\s\n]*\n/);
            for (let i = 0, n = blocks.length; i < n; i++) {
                const lines = blocks[i].split(/\n/);
                if (lines[0].startsWith('@')) {
                    // 有角色的内容，例如@我、@旁白、@角色名
                    const role_id = getRoleIdByName(lines[0].substring(1).trim());

                    if (lines[1].startsWith('#图片#')) {                                // 图片
                        const image = lines[2].trim();
                        if (lines[3]) {
                            const gallery_title = lines[3].substring(1).trim();
                            addToGallery(gallery_title, { type: 'GalleryItemImage', image, });
                            nodes.push({ type: 'Image', role_id, image, gallery_id: getGalleryIdByTitle(gallery_title) });
                        }
                        else {
                            nodes.push({ type: 'Image', role_id, image, });
                        }
                    }
                    else if (lines[1].startsWith('#视频#')) {                           // 视频
                        const text = lines[2].trim();
                        const video = lines[3].trim();
                        if (lines[4]) {
                            const gallery_title = lines[4].substring(1).trim();
                            addToGallery(gallery_title, { type: 'GalleryItemVideo', video, });
                            nodes.push({ type: 'Video', role_id, text, video, gallery_id: getGalleryIdByTitle(gallery_title) });
                        }
                        else {
                            nodes.push({ type: 'Video', role_id, text, video });
                        }
                    }
                    else if (lines[1].startsWith('#音频#')) {                                // 音频
                        const audio = lines[2].trim();
                        if (lines[3]) {
                            const gallery_title = lines[3].substring(1).trim();
                            addToGallery(gallery_title, { type: 'GalleryItemAudio', audio, role_id });
                            nodes.push({ type: 'Audio', role_id, audio, gallery_id: getGalleryIdByTitle(gallery_title) });
                        }
                        else {
                            nodes.push({ type: 'Audio', role_id, audio, });
                        }
                    }
                    else if (lines[1].startsWith('#链接#')) {                           // 链接
                        const title = lines[2].trim();
                        const text = lines[3].trim();
                        const link = lines[4].trim();
                        const image = lines[5].trim();
                        nodes.push({ type: 'Link', title, text, link, image, role_id, });
                    }
                    else if (lines[1].startsWith('#忙碌#')) {                           // 忙碌
                        const text = lines[2].trim();
                        // console.log('忙碌', text);
                        nodes.push({ type: 'Busy', text, target_role_id: role_id });
                    }
                    else if (lines[1].startsWith('#电话开始#')) {
                        const { call, block_index } = buildCallNode(blocks, i);
                        nodes.push(call);
                        i = block_index;
                    }
                    else {
                        const text = blocks[i].substring(lines[0].length + 1).trim();
                        nodes.push({ type: 'Text', text, role_id });                      // 文本
                    }
                }
                else {
                    // 不需要@角色的内容
                    if (lines[0].startsWith('#图片#')) {                            // 旁白图片
                        const image = lines[1].trim();
                        if (lines[2]) {
                            const gallery_title = lines[2].substring(1).trim();
                            addToGallery(gallery_title, { type: 'GalleryItemImage', image, });
                            nodes.push({ type: 'Image', role_id: -1, image, gallery_id: getGalleryIdByTitle(gallery_title) });
                        }
                        else {
                            nodes.push({ type: 'Image', role_id: -1, image, });
                        }
                    }
                    else if (lines[0].startsWith('#视频#')) {                           // 旁白视频
                        const text = lines[1].trim();
                        const video = lines[2].trim();
                        if (lines[3]) {
                            const gallery_title = lines[3].substring(1).trim();
                            addToGallery(gallery_title, { type: 'GalleryItemVideo', video, });
                            nodes.push({ type: 'Video', role_id: -1, text, video, gallery_id: getGalleryIdByTitle(gallery_title) });
                        }
                        else {
                            nodes.push({ type: 'Video', role_id: -1, text, video, });
                        }
                    }
                    else if (lines[0].startsWith('==')) {                               // 延迟
                        const time = parseFloat(lines[0].substring(2).trim()) * 60000;
                        nodes.push({ type: 'Delay', time });
                        // console.log('Delay for', time);
                    }
                    else if (lines[0].startsWith('#数值#')) {                          // 数值
                        const line = lines[1].trim();
                        const key = line.split(/[=\-+*/]/g)[0];
                        const value = parseInt(line.split(/[=\-+*/]/g)[1], 10);
                        const operator = line.match(/[=\-+*/]/g)[0];
                        nodes.push({ type: 'Number', key: key, value: value, operator: operator });
                    }
                    else if (lines[0].length > 0) {
                        nodes.push({ type: 'Text', role_id: -1, text: blocks[i].trim() });       // 旁白文本
                    }
                }
            }

            return nodes;
        }

        function buildNumbers(in_numbers) {
            if (!in_numbers) {
                return {};
            }
            else {
                const out_numbers = {};
                in_numbers.forEach(n => {
                    out_numbers[n.title] = n.number;
                });
                return out_numbers;
            }
        }

        function buildParagraph(in_paragraph) {
            const nodes = [];
            switch (in_paragraph.type) {
                case 'Node': {
                    nodes.push(...buildParagraphText(in_paragraph.text));
                    nodes[nodes.length - 1].next_paragraph_id = in_paragraph.next_id;
                    break;
                }

                case 'Branch': {
                    nodes.push({
                        type: 'Selection',
                        selections: in_paragraph.selections.map(s => ({
                            text: s.title,
                            next_paragraph_id: s.next_id,
                        })),
                    });
                    break;
                }

                case 'NumberBranch': {
                    const ranges = [];
                    const next_paragraph_ids = [];
                    for (let i = 0, n = in_paragraph.ranges.length; i < n; i++) {
                        const { value, next_id } = in_paragraph.ranges[i];
                        next_paragraph_ids.push(next_id);
                        if (i < n - 1) {
                            ranges.push(value);
                        }
                    }
                    nodes.push({
                        type: 'NumberBranch',
                        key: in_paragraph.key,
                        ranges,
                        next_paragraph_ids,
                    });
                    break;
                }

                case 'End': {
                    if (in_paragraph.gallery_id === -1 || !in_paragraph.gallery_id) {
                        nodes.push({ type: 'Ending', title: in_paragraph.title.trim(), text: in_paragraph.text.trim(), image: in_paragraph.image.trim() });
                    }
                    else {
                        nodes.push({ type: 'Ending', title: in_paragraph.title.trim(), text: in_paragraph.text.trim(), image: in_paragraph.image.trim(), gallery_id: in_paragraph.gallery_id });
                        const gallery = getGalleryById(in_paragraph.gallery_id);
                        gallery && gallery.items.push({ type: 'GalleryItemEnding', title: in_paragraph.title.trim(), text: in_paragraph.text.trim(), image: in_paragraph.image.trim() });
                    }
                    break;
                }

                case 'Lock': {
                    nodes.push({
                        type: 'Lock', uuid: in_paragraph.uuid, title: in_paragraph.title.trim(), text: in_paragraph.text.trim(),
                        pay_type: in_paragraph.pay_type, coin: in_paragraph.coin, diamond: in_paragraph.diamond, next_paragraph_id: in_paragraph.next_id
                    });
                    break;
                }

                default:
                    break;
            }

            return {
                id: in_paragraph.id,
                title: in_paragraph.title,
                chat_id: in_paragraph.chat_id,
                nodes: nodes,
            };
        }

        // paragraphs
        in_paragraphs.forEach(p => out_paragraphs.push(buildParagraph(p)));

        // gallery_ids in roles
        const gallery_ids = out_galleries.map(g => g.id);
        out_roles.forEach(r => {
            if (r.has_memory) {
                r.gallery_ids = [...gallery_ids];
            } else {
                r.gallery_ids = [];
            }
            return r;
        });

        const out_numbers = buildNumbers(in_numbers);

        const script = {
            id: outline.id,
            game_id: outline.id,
            // title: outline.title,
            // roles: out_roles,

            // test
            title: outline.title,
            roles: out_roles.map(r => ({ ...r, name: r.name })),

            galleries: out_galleries,
            paragraphs: out_paragraphs,
            numbers: out_numbers,
        };

        return script;
    }
    catch (e) {
        // @todo
        // 抛出异常，一般情况下在外部逻辑代码中需要上报build异常日志

        console.error(e);
        throw new Error();
    }
}