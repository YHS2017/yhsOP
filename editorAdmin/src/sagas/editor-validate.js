import uuid from "uuid-js";

export const ValidationCode = {
    TestError: 1000,
    InvalidChatIdOfParagraph: 1001,
    InvalidGalleryIdOfRole: 1002,

    RoleNameNotFound: 1003,
    GalleryTitleNotFound: 1004,
    NodeWithoutContentError: 1005,
    DuplicatedRoleName: 1006,
    ParagraphWithoutContentError: 1007,
    EndParagraphGalleryIdNotFound: 1008,
    InvalidCoinOfLock: 1009,
    InvalidParagraphType: 1010,
    NumberKeyNotFound: 1011,

    ImageNodeFormatError: 1100,
    ImageNodeGalleryFormatError: 1101,
    ImageNodeUrlNotFound: 1102,

    VideoNodeTextFormatError: 1110,
    VideoNodeGalleryFormatError: 1111,
    VideoNodeFormatError: 1112,
    VideoNodeUrlNotFound: 1113,

    LinkNodeTitleFormatError: 1120,
    LinkNodeTextFormatError: 1121,
    LinkNodeLinkFormatError: 1122,
    LinkNodeImageFormatError: 1123,
    LinkNodeFormatError: 1124,

    BusyNodeFormatError: 1130,
    BusyNodeRoleIsUserError: 1131,
    BusyNodeTextNotFound: 1132,

    DelayNodeInvalidTime: 1140,
    DelayNodeFormatError: 1141,

    AudioNodeFormatError: 1150,
    AudioNodeGalleryFormatError: 1151,
    AudioNodeUrlNotFound: 1152,

    CallStartNodeFormatError: 1160,
    CallNodeTitleNotFound: 1161,
    CallNodeImageNotFound: 1162,
    CallNodeLineRoleNotFound: 1163,
    CallEndNodeFormatError: 1164,
    CallNodeLineTextNotFound: 1165,
    CallNodeLineFormatError: 1166,
    CallStartNodeRoleIsPlayer: 1167,
    CallNodeGalleryFormatError: 1168,
    CallNodeNotComplete: 1169,

    NumberNodeFormatError: 1170,
    NumberNodeContentNotFound: 1171,

    SelectionNextParagraphNotFound: 1200,
    RangeNextParagraphNotFound: 1201,
    InvalidNumberBranchValue: 1202,
    RangeValueEqualOrGreaterThanPrev: 1203,


    TestWarning: 2000,

    InvalidUrl: 2001,
};

export class ValidationError {
    constructor(code, extra) {
        this.code = code;
        this.extra = extra;
    }
}
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.toString = function () {
    // return this.getContext() + this.getMessage() +  `  (${this.code})`;
    return this.getContext() + this.getMessage();
};

ValidationError.prototype.getContext = function () {
    const {paragraph_title, line_number} = this.extra;
    if (paragraph_title) {
        if (line_number) {
            return `<${paragraph_title}>, 第${line_number}行: `;
        }
        else {
            return `<${paragraph_title}>: `;
        }
    }
    else {
        return '';
    }
};

ValidationError.prototype.getMessage = function () {
    switch (this.code) {
        case ValidationCode.InvalidUrl:
            return `链接地址格式错误: "${this.extra.url}"`;

        case ValidationCode.InvalidGalleryIdOfRole:
            return `角色的回忆不存在`;

        case ValidationCode.RoleNameNotFound:
            return `角色不存在: "${this.extra.name}"`;

        case ValidationCode.GalleryTitleNotFound:
            return `回忆不存在: "${this.extra.title}"`;

        case ValidationCode.DuplicatedRoleName:
            return `角色名重复: "${this.extra.name}"`;

        case ValidationCode.ParagraphWithoutContentError:
            return `段落缺少内容`;

        case ValidationCode.InvalidChatIdOfParagraph:
            return `聊天窗口所选角色不存在或未选择`;

        case ValidationCode.InvalidCoinOfLock:
            return `锁的价格设置错误, 必须为大于零的整数`;

        case ValidationCode.InvalidParagraphType:
            return `错误的段落类型: "${this.extra.type}"`;

        case ValidationCode.NumberKeyNotFound:
            return `数值不存在: "${this.extra.key}"`;

        case ValidationCode.NodeWithoutContentError:
            return `缺少对白内容`;

        case ValidationCode.EndParagraphGalleryIdNotFound:
            return `结局所选回忆错误, 请重新选择`;

        case ValidationCode.ImageNodeGalleryFormatError:
            return `#图片#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

        case ValidationCode.ImageNodeFormatError:
            return `#图片#格式错误: "${this.extra.text}"`;

        case ValidationCode.ImageNodeUrlNotFound:
            return `#图片#格式错误, 缺少图片链接`;

        case ValidationCode.VideoNodeTextFormatError:
            return `#视频#格式错误, 需要填写视频简介`;

        case ValidationCode.VideoNodeGalleryFormatError:
            return `#视频#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

        case ValidationCode.VideoNodeFormatError:
            return `#视频#格式错误: "${this.extra.text}"`;

        case ValidationCode.VideoNodeUrlNotFound:
            return `#视频#格式错误, 缺少视频链接`;

        case ValidationCode.AudioNodeGalleryFormatError:
            return `#音频#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

        case ValidationCode.AudioNodeFormatError:
            return `#音频#格式错误: "${this.extra.text}"`;

        case ValidationCode.AudioNodeUrlNotFound:
            return `#音频#格式错误, 缺少音频链接`;

        case ValidationCode.LinkNodeTitleFormatError:
            return `#链接#格式错误, 缺少标题`;

        case ValidationCode.LinkNodeTextFormatError:
            return `#链接#格式错误, 缺少描述`;

        case ValidationCode.LinkNodeLinkFormatError:
            return `#链接#格式错误, 缺少网址链接`;

        case ValidationCode.LinkNodeImageFormatError:
            return `#链接#格式错误, 缺少预览图链接`;

        case ValidationCode.LinkNodeFormatError:
            return `#链接#格式错误: "${this.extra.text}"`;

        case ValidationCode.BusyNodeFormatError:
            return `#忙碌#格式错误: "${this.extra.text}"`;

        case ValidationCode.BusyNodeRoleIsUserError:
            return `#忙碌#格式错误, 所属角色不能是"我"`;

        case ValidationCode.BusyNodeTextNotFound:
            return `#忙碌#格式错误, 缺少忙碌提示文本`;

        case ValidationCode.DelayNodeInvalidTime:
            return `==延时格式错误，"=="后不是数字: "${this.extra.number}"`;

        case ValidationCode.DelayNodeFormatError:
            return `==延时格式错误: "${this.extra.text}"`;

        case ValidationCode.CallStartNodeFormatError:
            return `#电话开始#格式错误: "${this.extra.text}"`;

        case ValidationCode.CallNodeTitleNotFound:
            return `#电话开始#格式错误, 缺少标题`;

        case ValidationCode.CallNodeImageNotFound:
            return `#电话开始#格式错误, 缺少图片`;

        case ValidationCode.CallNodeLineRoleNotFound:
            return `电话过程格式错误, 缺少@角色名`;

        case ValidationCode.CallEndNodeFormatError:
            return `#电话结束#格式错误: "${this.extra.text}"`;

        case ValidationCode.CallNodeLineTextNotFound:
            return `电话过程格式错误, 缺少文本`;

        case ValidationCode.CallNodeLineFormatError:
            return `电话过程格式错误: "${this.extra.text}"`;

        case ValidationCode.CallStartNodeRoleIsPlayer:
            return `#电话开始#格式错误, 所属角色不能是"我"`;

        case ValidationCode.CallNodeGalleryFormatError:
            return `#电话开始#回忆格式错误: "${this.extra.text}", 请在回忆名称前添加">"符号`;

        case ValidationCode.CallNodeNotComplete:
            return '缺少#电话结束#';

        case ValidationCode.NumberNodeFormatError:
            return `#数值#格式错误: "${this.extra.text}"`;

        case ValidationCode.NumberNodeContentNotFound:
            return `#数值#格式错误, 缺少数值表达式`;

        case ValidationCode.SelectionNextParagraphNotFound:
            return `分支必须连接到下一个段落`;

        case ValidationCode.RangeNextParagraphNotFound:
            return `分支必须连接到下一个段落`;

        case ValidationCode.InvalidNumberBranchValue:
            return `分支的数值不是有效数字: 第${this.extra.index + 1}个分支`;

        case ValidationCode.RangeValueEqualOrGreaterThanPrev:
            return `数值必须大于前一个分支的数值: 第${this.extra.index + 1}个分支`;

        default:
            return '未知错误';
    }
};

export class ValidationWarning {
    constructor(code, extra) {
        this.code = code;
        this.extra = extra;
    }
}
ValidationWarning.prototype.name = 'ValidationWarning';

// const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
const URL_PATTERN = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);

function isValidUrl(url) {
    return URL_PATTERN.test(url);
}

export function validateProjectContent(content) {
    const {roles, galleries, paragraphs, numbers} = content;
    const role_names = {};
    const errors = [];
    const warnings = [];
    let current_line_number = null;
    let current_paragraph_id = null;
    let current_paragraph_title = null;
    let validate_state = 'normal';  // normal | call

    function addError(code, extra) {
        errors.push(new ValidationError(code, {
            ...getCurrentContext(),
            ...(extra || {}),
        }));
    }

    function addWarning(code, extra) {
        warnings.push(new ValidationWarning(code, {
            ...getCurrentContext(),
            ...extra,
        }));
    }

    function getParagraph(id) {
        return paragraphs.find(p => p.id === id);
    }

    function getGallery(id) {
        return galleries.find(g => g.id === id);
    }

    function getRole(id) {
        return roles.find(r => r.id === id);
    }

    function getRoleByChatId(chat_id) {
        return roles.find(r => r.chat_id === chat_id);
    }

    function getRoleByName(name) {
        return roles.find(r => r.name === name);
    }

    function getGalleryById(id) {
        return galleries.find(g => g.id === id);
    }

    function getGalleryByTitle(title) {
        return galleries.find(g => g.title === title);
    }

    function getCurrentContext() {
        return {paragraph_id: current_paragraph_id, paragraph_title: current_paragraph_title, line_number: current_line_number};
    }

    function validateRole(role) {
        const {name, gallery_ids} = role;
        if (role_names[name]) {
            addError(ValidationCode.DuplicatedRoleName, {name})
        }

        for (let i = 0; i < gallery_ids.length; i++) {
            const gallery_id = gallery_ids[i];
            if (!gallery_id) {
                addError(ValidationCode.InvalidGalleryIdOfRole, {gallery_id});
            }
        }
    }

    function validateRoles() {
        for (let i = 0; i < roles.length; i++) {
            validateRole(roles[i]);
        }
    }

    function validateRoleName(name) {
        switch (name) {
            case '我':
                break;

            default:
                const role = getRoleByName(name);
                if (!role) {
                    addError(ValidationCode.RoleNameNotFound, {name});
                }
        }
    }

    function validateNumber(key) {
        if (!numbers || !numbers.find(n => n.title === key)) {
            addError(ValidationCode.NumberKeyNotFound, {key});
        }
    }

    function validateGalleryTitle(title) {
        const gallery = getGalleryByTitle(title);
        if (!gallery) {
            addError(ValidationCode.GalleryTitleNotFound, {title});
        }
    }

    function validateGalleryId(id) {
        if (id !== -1) {
            const gallery = getGalleryById(id);
            if (!gallery) {
                addError(ValidationCode.EndParagraphGalleryIdNotFound);
            }
        }
    }

    function validateUrl(url) {
        if (!isValidUrl(url)) {
            // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
            //     ...getCurrentContext(),
            //     url,
            // }));

            // 目前暂时把无效的地址作为错误处理
            addError(ValidationCode.InvalidUrl, {url});
        }
    }

    function validateImageUrl(url) {
        if (!isValidUrl(url)) {
            // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
            //     ...getCurrentContext(),
            //     url,
            // }));

            // 目前暂时把无效的图片地址作为错误处理
            addError(ValidationCode.InvalidUrl, {url});
        }
    }

    function validateVideoUrl(url) {
        if (!isValidUrl(url)) {
            // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
            //     ...getCurrentContext(),
            //     url,
            // }));

            // 目前暂时把无效的视频地址作为错误处理
            addError(ValidationCode.InvalidUrl, {url});
        }
    }

    function validateAudioUrl(url) {
        if (!isValidUrl(url)) {
            // warnings.push(new ValidationWarning(ValidationCode.InvalidUrl, {
            //     ...getCurrentContext(),
            //     url,
            // }));

            // 目前暂时把无效的图片地址作为错误处理
            addError(ValidationCode.InvalidUrl, {url});
        }
    }

    function validateImageNode(lines) {
        // #图片#
        if (lines[0].length > 4) {
            addError(ValidationCode.ImageNodeFormatError, {text: lines[0].substring(4)});
        }

        // Url
        if (lines[1]) {
            current_line_number++;
            validateImageUrl(lines[1].trim());
        }
        else {
            addError(ValidationCode.ImageNodeUrlNotFound);
            return;
        }

        // Gallery
        if (lines[2]) {
            current_line_number++;
            if (lines[2].startsWith('>')) {
                const gallery_title = lines[2].substring(1).trim();
                validateGalleryTitle(gallery_title);
            }
            else {
                addError(ValidationCode.ImageNodeGalleryFormatError, {text: lines[2]});
            }
        }
        else {
            return;
        }

        if (lines[3]) {
            current_line_number++;
            addError(ValidationCode.ImageNodeFormatError, {text: lines[3]});
            current_line_number += lines.length - 4;
        }
    }

    function validateAudioNode(lines) {
        // #音频#
        if (lines[0].length > 4) {
            addError(ValidationCode.AudioNodeFormatError, {text: lines[0].substring(4)});
        }

        // Url
        if (lines[1]) {
            current_line_number++;
            validateAudioUrl(lines[1].trim());
        }
        else {
            addError(ValidationCode.AudioNodeUrlNotFound);
            return;
        }

        // Gallery
        if (lines[2]) {
            current_line_number++;
            if (lines[2].startsWith('>')) {
                const gallery_title = lines[2].substring(1).trim();
                validateGalleryTitle(gallery_title);
            }
            else {
                addError(ValidationCode.AudioNodeGalleryFormatError, {text: lines[2]});
            }
        }
        else {
            return;
        }

        if (lines[3]) {
            current_line_number++;
            addError(ValidationCode.AudioNodeFormatError, {text: lines[3]});
            current_line_number += lines.length - 4;
        }
    }

    function validateCallStartNode(lines, role_name) {
        if (role_name === '我') {
            current_line_number--;
            addError(ValidationCode.CallStartNodeRoleIsPlayer);
            current_line_number++;
        }

        // #电话开始#
        if (lines[0].length > 6) {
            addError(ValidationCode.CallStartNodeFormatError, {text: lines[0].substring(6)});
        }

        // Title
        if (lines[1]) {
            current_line_number++;
        }
        else {
            addError(ValidationCode.CallNodeTitleNotFound);
            return;
        }

        // Image
        if (lines[2]) {
            current_line_number++;
            validateImageUrl(lines[2].trim());
        }
        else {
            addError(ValidationCode.CallNodeImageNotFound);
            return;
        }

        // Gallery
        if (lines[3]) {
            current_line_number++;
            if (lines[3].startsWith('>')) {
                const gallery_title = lines[3].substring(1).trim();
                validateGalleryTitle(gallery_title);
            }
            else {
                addError(ValidationCode.VideoNodeGalleryFormatError, {text: lines[3]});
            }
        }

        if (lines[4]) {
            current_line_number++;
            addError(ValidationCode.CallStartNodeFormatError, {text: lines[4]});
            current_line_number += lines.length - 5;
        }

        validate_state = 'call';
    }

    function validateCallLine(block) {
        const lines = block.split(/\n/);
        if (lines[0].startsWith('@')) {
            const role_name = lines[0].substring(1).trim();
            validateRoleName(role_name);

            if (lines[1]) {
                current_line_number++;
            }
            else {
                addError(ValidationCode.CallNodeLineTextNotFound);
                return;
            }

            if (lines[2]) {
                current_line_number++;
                validateAudioUrl(lines[2].trim());
                return;
            }

            if (lines[3]) {
                current_line_number++;
                addError(ValidationCode.CallNodeLineFormatError, {text: lines[3]});
                current_line_number += lines.length - 4;
            }
        }
        else if (lines[0].startsWith('#电话结束#')) {
            validateCallEndNode(lines);
        }
        else {
            addError(ValidationCode.CallNodeLineRoleNotFound);
        }
    }

    function validateCallEndNode(lines) {
        // #电话结束#
        if (lines[0].length > 6) {
            addError(ValidationCode.CallEndNodeFormatError, {text: lines[0].substring(6)});
        }

        if (lines[1]) {
            current_line_number++;
            addError(ValidationCode.CallEndNodeFormatError, {text: lines[1]});
            current_line_number += lines.length - 2;
        }

        validate_state = 'normal';
    }

    function validateVideoNode(lines) {
        // #视频#
        if (lines[0].length > 4) {
            addError(ValidationCode.VideoNodeFormatError, {text: lines[0].substring(4)});
        }

        // Text
        if (lines[1]) {
            current_line_number++;
        }
        else {
            addError(ValidationCode.VideoNodeTextFormatError);
            return;
        }

        // Url
        if (lines[2]) {
            current_line_number++;
            validateVideoUrl(lines[2].trim());
        }
        else {
            addError(ValidationCode.VideoNodeUrlNotFound);
            return;
        }

        // Gallery
        if (lines[3]) {
            current_line_number++;
            if (lines[3].startsWith('>')) {
                const gallery_title = lines[3].substring(1).trim();
                validateGalleryTitle(gallery_title);
            }
            else {
                addError(ValidationCode.VideoNodeGalleryFormatError, {text: lines[3]});
            }
        }
        else {
            return;
        }

        if (lines[4]) {
            current_line_number++;
            addError(ValidationCode.VideoNodeFormatError, {text: lines[4]});
            current_line_number += lines.length - 5;
        }
    }

    function validateLinkNode(lines) {
        // #链接#
        if (lines[0].length > 4) {
            addError(ValidationCode.LinkNodeFormatError, {text: lines[0].substring(4)});
        }

        // 标题
        if (lines[1]) {
            current_line_number++;
        }
        else {
            addError(ValidationCode.LinkNodeTitleFormatError);
        }

        // 描述
        if (lines[2]) {
            current_line_number++;
        }
        else {
            addError(ValidationCode.LinkNodeTextFormatError);
        }

        // 链接
        if (lines[3]) {
            current_line_number++;
            validateUrl(lines[3].trim());
        }
        else {
            addError(ValidationCode.LinkNodeLinkFormatError);
        }

        // 预览图
        if (lines[4]) {
            current_line_number++;
            validateImageUrl(lines[4].trim());
        }
        else {
            addError(ValidationCode.LinkNodeImageFormatError);
        }

        if (lines[5]) {
            current_line_number++;
            addError(ValidationCode.LinkNodeFormatError, {text: lines[5]});
            current_line_number += lines.length - 6;
        }
    }

    function validateBusyNode(lines, role_name) {
        if (role_name === '我') {
            current_line_number--;
            addError(ValidationCode.BusyNodeRoleIsUserError);
            current_line_number++;
        }

        // #忙碌#
        if (lines[0].length > 4) {
            addError(ValidationCode.BusyNodeFormatError, {text: lines[0].substring(4)});
        }

        // Text
        if (lines[1]) {
            current_line_number++;
        }
        else {
            addError(ValidationCode.BusyNodeTextNotFound);
            return;
        }

        if (lines[2]) {
            current_line_number++;
            addError(ValidationCode.BusyNodeFormatError, {text: lines[2]});
            current_line_number += lines.length - 3;
        }
    }

    function validateTextNode(lines) {
        current_line_number += lines.length - 1;
    }

    function validateDelayNode(lines) {
        const number = lines[0].substring(2).trim();
        if (isNaN(number)) {
            addError(ValidationCode.DelayNodeInvalidTime, {number});
        }

        if (lines[1]) {
            current_line_number++;
            addError(ValidationCode.DelayNodeFormatError, {text: lines[1]});
            current_line_number += lines.length - 2;
        }
    }

    function validateNumberNode(lines) {
        if (lines[1]) {
            const line = lines[1].trim();
            current_line_number++;
            const elements = line.split(/[=\-+*/]/g);
            if (!elements || elements.length !== 2) {
                addError(ValidationCode.NumberNodeFormatError, {text: line});
            }
            else {
                const key = elements[0];
                const value = parseInt(elements[1], 10);
                const operator = line.match(/[=\-+*/]/g)[0];
                if (!key || !value || ! operator) {
                    addError(ValidationCode.NumberNodeFormatError, {text: line});
                }
                else {
                    validateNumber(key);
                }
            }
        }
        else {
            addError(ValidationCode.NumberNodeContentNotFound);
            return;
        }

        if (lines[2]) {
            current_line_number++;
            addError(ValidationCode.NumberNodeFormatError, {text: lines[2]});
            current_line_number += lines.length - 3;
        }
    }

    function validateBlock(block) {
        switch (validate_state) {
            case 'call':
                validateCallLine(block);
                break;

            case 'normal':
            default: {

                const lines = block.split(/\n/);
                if (lines[0].startsWith('@')) {
                    const role_name = lines[0].substring(1).trim();
                    validateRoleName(role_name);

                    if (lines.length > 1) {
                        current_line_number++;
                        if (lines[1].startsWith('#图片#')) {                                // 图片
                            validateImageNode(lines.slice(1));
                        }
                        else if (lines[1].startsWith('#视频#')) {                           // 视频
                            validateVideoNode(lines.slice(1));
                        }
                        else if (lines[1].startsWith('#链接#')) {                           // 链接
                            validateLinkNode(lines.slice(1));
                        }
                        else if (lines[1].startsWith('#忙碌#')) {                           // 忙碌
                            validateBusyNode(lines.slice(1), role_name);
                        }
                        else if (lines[1].startsWith('#音频#')) {                            // 音频
                            validateAudioNode(lines.slice(1));
                        }
                        else if (lines[1].startsWith('#电话开始#')) {
                            validateCallStartNode(lines.slice(1), role_name);
                        }
                        else {
                            validateTextNode(lines.slice(1));
                        }
                    }
                    else {  // lines.length === 1
                        addError(ValidationCode.NodeWithoutContentError);
                    }
                }
                else {
                    if (lines[0].startsWith('#图片#')) {                                      // 旁白图片
                        validateImageNode(lines);
                    }
                    else if (lines[0].startsWith('#视频#')) {                                 // 旁白视频
                        validateVideoNode(lines);
                    }
                    else if (lines[0].startsWith('==')) {                                   // 延迟
                        validateDelayNode(lines);
                    }
                    else if (lines[0].startsWith('#数值#')) {
                        validateNumberNode(lines);
                    }
                    else if (lines[0].length > 0) {                                             // 旁白文本
                        validateTextNode(lines);
                    }
                }
            }
        }
    }

    function trimParagraphText(text) {
        // 移除首尾的多余空行和空格
        return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
    }

    function validateNodeParagraph(paragraph) {
        // // test
        // if (paragraph.id !== 1) {
        //     return;
        // }

        const blank_text = paragraph.text.match(/^[\s\n]+/);
        current_line_number = blank_text
            ?
            blank_text.toString().match(/\n/g) !== null
                ?
                blank_text.toString().match(/\n/g).length + 1
                :
                1
            :
            1;
        const text = trimParagraphText(paragraph.text);
        const pattern = new RegExp(/\n[\s\n]*\n/, 'g');
        let index = 0;
        if (text.length <= 0) {
            addError(ValidationCode.ParagraphWithoutContentError);
            return;
        }

        // 每两个或者两个以上的换行，包括换行之间有空格，认为是分隔符，将文本分割为多个块(block)
        let block_splitter = pattern.exec(text);
        while (true) {
            if (block_splitter) {
                const length = block_splitter ? block_splitter.toString().length : 0;
                const block = text.substring(index, pattern.lastIndex - length);
                validateBlock(block);
                index = pattern.lastIndex;
                current_line_number += block_splitter.toString().match(/\n/g).length;
                block_splitter = pattern.exec(text);
            }
            else {
                const block = text.substring(index);
                validateBlock(block);
                break;
            }
        }

        switch (validate_state) {
            case 'call':
                addError(ValidationCode.CallNodeNotComplete);
                break;

            case 'normal':
            default:
                break;
        }
    }

    function validateSelection(selection, index) {
        const next_paragraph = getParagraph(selection.next_id);
        if (!next_paragraph) {
            current_paragraph_title = selection.title;
            addError(ValidationCode.SelectionNextParagraphNotFound, {index});
        }
    }

    function validateRange(range, prev, index, last_index) {
        if (index !== last_index) {
            const {value} = range;
            if (typeof(range.value) !== 'number' || Number.isNaN(value)) {
                addError(ValidationCode.InvalidNumberBranchValue, {index});
            }
            else {
                if (prev && typeof(prev.value) === 'number' && prev.value > range.value) {
                    addError(ValidationCode.RangeValueEqualOrGreaterThanPrev, {index});
                }
            }
        }

        const next_paragraph = getParagraph(range.next_id);
        if (!next_paragraph) {
            addError(ValidationCode.RangeNextParagraphNotFound, {index});
        }
    }

    function validateBranchParagraph(paragraph) {
        const {selections} = paragraph;
        for (let i = 0, n = selections.length; i < n; i++) {
            validateSelection(selections[i], i);
        }
    }

    function validateNumberBranchParagraph(paragraph) {
        const {key, ranges} = paragraph;
        validateNumber(key);
        for (let i = 0, n = ranges.length; i < n; i++) {
            validateRange(ranges[i], ranges[i - 1], i, n - 1);
        }
    }

    function validateEndParagraph(paragraph) {
        const {gallery_id} = paragraph;
        validateGalleryId(gallery_id);
    }

    function validateLockParagraph(paragraph) {
        const {
            id, title, chat_id, coin,
        } = paragraph;
        current_paragraph_id = id;
        current_paragraph_title = title;
        current_line_number = null;
        if (!getRoleByChatId(chat_id)) {
            addError(ValidationCode.InvalidChatIdOfParagraph);
        }

        if (!Number.isSafeInteger(coin) || coin <= 0) {
            addError(ValidationCode.InvalidCoinOfLock);
        }
    }

    function validateParagraph(paragraph) {
        const {id, title, chat_id} = paragraph;
        current_paragraph_id = id;
        current_paragraph_title = title;
        current_line_number = null;
        if (!getRoleByChatId(chat_id)) {
            addError(ValidationCode.InvalidChatIdOfParagraph);
        }

        switch (paragraph.type) {
            case 'Node':
                validateNodeParagraph(paragraph);
                break;

            case 'Branch':
                validateBranchParagraph(paragraph);
                break;

            case 'NumberBranch':
                validateNumberBranchParagraph(paragraph);
                break;

            case 'End':
                validateEndParagraph(paragraph);
                break;

            case 'Lock':
                validateLockParagraph(paragraph);
                break;

            default:
                addError(ValidationCode.InvalidParagraphType, paragraph.type);
                break;
        }
    }

    function validateParagraphs() {
        for (let i = 0; i < paragraphs.length; i++) {
            validateParagraph(paragraphs[i]);
        }
    }

    validateRoles();
    validateParagraphs();

    // console.log('warnings');
    // console.log(warnings);
    // console.log('errors');
    // console.log(errors);

    return {
        errors,
        warnings,
    }
}