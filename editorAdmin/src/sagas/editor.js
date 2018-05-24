import { take, takeEvery, fork, put, select } from 'redux-saga/effects';
import uuid from 'uuid-js';
import Api from './api';
import config from '../config';
import AppError, { AppErrorCode } from './AppError';
import { setAppLoading, setAppMessage, setAppAlert } from './app';
import { insert } from './utils';
import { validateProjectContent } from './editor-validate';
import { buildProject } from './editor-build';
import { getToken } from './user';
import RGBaster from './rgbaster';

export function* getOntline() {
  return yield select(store => store.editor.outline);
}

function* getErrors() {
  return yield select(store => store.editor.errors);
}

export function* getParagraph(id) {
  return yield select(store => store.editor.content.paragraphs.find(p => p.id === id));
}

export function* getContent() {
  return yield select(store => store.editor.content);
}

export function* getParagraphs() {
  return yield select(store => store.editor.content.paragraphs);
}

function* getFirstParagraph() {
  return yield select(store => store.editor.content.paragraphs[0]);
}

function* getOperations() {
  return yield select(store => store.editor.operations);
}

function* getOperationIndex() {
  return yield select(store => store.editor.operation_index);
}

function* getCurrentOperation() {
  const editor = yield select(store => store.editor);
  return editor.operations[editor.operation_index];
}

function* getNextOperation() {
  const editor = yield select(store => store.editor);
  return editor.operations[editor.operation_index + 1];
}

function* isFirstParagraph(id) {
  const first = yield getFirstParagraph();
  return first.id === id;
}

export function* getRoles() {
  return yield select(store => store.editor.content.roles);
}

export function* getRole(id) {
  return yield select(store => store.editor.content.roles.find(r => r.id === id));
}

function* updateProjectContent(content) {
  yield put({
    type: 'UPDATE_PROJECT_CONTENT',
    content: content,
  })
}

function* updateParagraph(...updated_paragraph) {
  yield put({
    type: 'UPDATE_PARAGRAPHS',
    paragraphs: insert(yield getParagraphs(), ...updated_paragraph),
  });
}

function* newParagraphId() {
  const paragraphs = yield getParagraphs();
  return Math.max(...paragraphs.map(p => p.id)) + 1;
}

function* createNodeParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'Node',
    title: '未命名段落',
    chat_id: -1,
    text: '',
    next_id: -1,
  };
}

function* createBranchParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'Branch',
    chat_id: -1,
    expanded: true,
    selections: [
      yield createSelection(),
      yield createSelection(),
    ]
  };
}

function createRange(value) {
  return {
    value,
    next_id: -1,
  };
}

function createSelection() {
  return {
    title: '未命名选项',
    next_id: -1,
  };
}

function* createEndParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'End',
    chat_id: -1,
    title: '未命名结局',
    text: '结局描述',
    gallery_id: -1,
    image: '',
    next_id: -1,
  };
}

function* createLockParagraph() {
  return {
    id: yield newParagraphId(),
    type: 'Lock',
    uuid: uuid.create(4).toString(),
    title: '未命名锁',
    chat_id: -1,
    text: '无描述',
    pay_type: 'WaitOrPay',
    coin: 1,
    diamond: -1,
    next_id: -1,
  };
}

function* linkParagraphs(action) {
  const { a, b } = action;
  const paragraph_a = yield getParagraph(a.id);
  if (a.id === b.id) {
    yield setAppMessage('不能连接相同的段落');
  }
  else {
    yield updateParagraph(setParagraphNextId(paragraph_a, a.index, b.id));
    return { type: 'Link', a: { ...a }, b: { ...b } };
  }
}

function* moveParagraph(action) {
  const { from_parent, to_parent, child } = action;
  console.log('Move paragraph', from_parent.id, to_parent.id, child.id);

  const from_paragraph = yield getParagraph(from_parent.id);
  const to_paragraph = yield getParagraph(to_parent.id);
  const child_paragraph = yield getParagraph(child.id);
  if (to_paragraph.id === child_paragraph.id) {
    yield setAppMessage('不能将段落作为自己的下一个段落');
  }
  else if (getParagraphNextId(to_paragraph, to_parent.index) !== -1) {
    yield setAppMessage(`[${to_paragraph.title}]段落的下一个段落不为空`);
  }
  else {
    if (from_paragraph.id === to_paragraph.id) {
      const p1 = setParagraphNextId(from_paragraph, from_parent.index, -1);
      const p2 = setParagraphNextId(p1, to_parent.index, child_paragraph.id);
      yield updateParagraph(p2);
    }
    else {
      yield updateParagraph(
        setParagraphNextId(from_paragraph, from_parent.index, -1),
        setParagraphNextId(to_paragraph, to_parent.index, child_paragraph.id)
      );
    }

    return { type: 'Move', from_parent, to_parent, child };
  }
}

function* deleteBranchIndex(action) {
  const { paragraph_id, branch_index } = action;
  const paragraphs = yield getParagraphs();
  const branch = yield getParagraph(paragraph_id);
  const { selections, ranges } = branch;
  let items = [];
  switch (branch.type) {
    case 'Branch':
      items = selections;
      break;
    case 'NumberBranch':
      items = ranges;
      break;
    default:
      break;
  }
  const parents = [];
  let deleted_item = null;
  if (items.length === 2) {
    // 如果只有2条分支，则将该段落删除
    const next_id = branch_index === 0 ? items[1].next_id : items[0].next_id;
    const delete_id = paragraph_id;
    const updated_paragraphs = [];
    // 所有该段落的上一个段落，都将被修改next_id
    paragraphs.forEach(p => {
      if (p.id !== delete_id) {
        switch (p.type) {
          case 'Node':
          case 'Lock': {
            if (p.next_id === delete_id) {
              parents.push({ paragraph_id: p.id });
              updated_paragraphs.push({ ...p, next_id });
            }
            else {
              updated_paragraphs.push(p);
            }
            break;
          }

          case 'Branch': {
            updated_paragraphs.push({
              ...p,
              selections: p.selections.map((s, i) => {
                if (s.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...s, next_id };
                }
                else {
                  return s;
                }
              })
            });
            break;
          }

          case 'NumberBranch': {
            updated_paragraphs.push({
              ...p,
              ranges: p.ranges.map((r, i) => {
                if (r.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...r, next_id };
                }
                else {
                  return r;
                }
              })
            });
            break;
          }

          case 'End':
          default:
            updated_paragraphs.push(p);
        }
      }
      else {
        updated_paragraphs.push(p);
      }
    });

    yield updateProjectContent({
      ...yield getContent(),
      paragraphs: updated_paragraphs,
    });
  }
  else {
    deleted_item = items.splice(branch_index, 1)[0];
    switch (branch.type) {
      case 'Branch':
        yield updateParagraph({
          ...branch,
          selections: [...items],
        });
        break;
      case 'NumberBranch':
        yield updateParagraph({
          ...branch,
          ranges: [...items],
        });
        break;
      default:
        break;
    }
  }

  // 移除所有未连接的段落，可以优化为遍历子段落的方式
  const deleted_paragraphs = yield removeUnlinkedParagraphs();

  return { type: 'DeleteBranchIndex', parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs };
}

function* addBranchIndex(action) {
  const { paragraph_id } = action;
  const branch = yield getParagraph(paragraph_id);
  switch (branch.type) {
    case 'Branch':
      const { selections } = branch;
      if (selections.length >= 5) {
        yield setAppMessage('最多支持5个分支');
        return null;
      }
      else {
        const item = yield createSelection();
        yield updateParagraph({
          ...branch,
          selections: [...selections, item]
        });

        return { type: 'AddBranchIndex', paragraph_id, added_item: null };
      }

    case 'NumberBranch':
      const { ranges } = branch;
      if (ranges.length >= 5) {
        yield setAppMessage('最多支持5个分支');
        return null;
      }
      else {
        const last = ranges.pop();
        const value = 20 + ranges[ranges.length - 1 < 0 ? 0 : ranges.length - 1].value;
        const item = yield createRange();
        yield updateParagraph({
          ...branch,
          ranges: [...ranges, { ...last, value }, item]
        });

        return { type: 'AddBranchIndex', paragraph_id, added_item: null };
      }

    default:
      break;
  }
}

function* disconnectParagraphs(action) {
  const { paragraph_id, branch_index } = action;
  const paragraph = yield getParagraph(paragraph_id);
  const next_id = getParagraphNextId(paragraph, branch_index);
  yield updateParagraph(setParagraphNextId(paragraph, branch_index, -1));
  return { type: 'Disconnect', paragraph_id, branch_index, next_id };
}

function* removeUnlinkedParagraphs() {
  const paragraphs = yield getParagraphs();
  const updated_paragraphs = [];
  const deleted_paragraphs = [];
  const searching = [paragraphs[0]];
  const searched = {};

  function _getParagraph(id) {
    return paragraphs.find(p => p.id === id);
  }

  function addSearching(id) {
    if (id !== -1) {
      searching.push(_getParagraph(id));
    }
  }

  while (searching.length > 0) {
    const paragraph = searching.pop();
    if (searched[paragraph.id]) {
      continue;
    }

    searched[paragraph.id] = true;
    switch (paragraph.type) {
      case 'Branch':
        paragraph.selections.forEach(s => addSearching(s.next_id));
        break;

      case 'NumberBranch':
        paragraph.ranges.forEach(r => addSearching(r.next_id));
        break;

      default:
        addSearching(paragraph.next_id);
        break;
    }
  }

  paragraphs.forEach(p => {
    if (searched[p.id]) {
      updated_paragraphs.push(p);
    }
    else {
      deleted_paragraphs.push(p);
    }
  });

  yield updateProjectContent({
    ...yield getContent(),
    paragraphs: updated_paragraphs,
  });

  console.log('Deleted unlinked paragraphs', deleted_paragraphs);

  return deleted_paragraphs;
}

function* watchOperations() {
  while (true) {
    try {
      const action = yield take([
        'INSERT_NODE_PARAGRAPH',
        'INSERT_BRANCH_PARAGRAPH',
        'INSERT_END_PARAGRAPH',
        'INSERT_LOCK_PARAGRAPH',
        'DELETE_PARAGRAPH',
        'EXPAND_BRANCH',
        'LINK_PARAGRAPHS',
        'DELETE_BRANCH_INDEX',
        'ADD_BRANCH_INDEX',
        'MOVE_PARAGRAPH',
        'DISCONNECT_PARAGRAPHS',
      ]);

      let operation = null;
      // 用于redo/undo操作
      switch (action.type) {
        case 'INSERT_NODE_PARAGRAPH':
          operation = yield insertNodeParagraph(action);
          break;

        case 'INSERT_BRANCH_PARAGRAPH':
          operation = yield insertBranchParagraph(action);
          break;

        case 'INSERT_END_PARAGRAPH':
          operation = yield insertEndParagraph(action);
          break;

        case 'INSERT_LOCK_PARAGRAPH':
          operation = yield insertLockParagraph(action);
          break;

        case 'DELETE_PARAGRAPH':
          operation = yield deleteParagraph(action);
          break;

        case 'EXPAND_BRANCH':
          yield expandBranch(action);
          break;

        case 'LINK_PARAGRAPHS':
          operation = yield linkParagraphs(action);
          break;

        case 'MOVE_PARAGRAPH':
          operation = yield moveParagraph(action);
          break;

        case 'DELETE_BRANCH_INDEX':
          operation = yield deleteBranchIndex(action);
          break;

        case 'ADD_BRANCH_INDEX':
          operation = yield addBranchIndex(action);
          break;

        case 'DISCONNECT_PARAGRAPHS':
          operation = yield disconnectParagraphs(action);
          break;

        default:
          break;
      }

      if (operation) {
        yield addOperation(operation);
      }
    }
    catch (e) {
      if (e instanceof AppError) {
        if (e.code === AppErrorCode.InvalidOperation) {
          yield setAppMessage(e.extra);
        }
      }
      else {
        throw e;
      }
    }
  }
}

const MAX_OPERATIONS = 20;
function* addOperation(operation) {
  const operations = yield getOperations();
  const operation_index = yield getOperationIndex();
  const length = operations.length;
  if (length >= MAX_OPERATIONS) {
    yield updateOperations([
      ...operations.slice(-(MAX_OPERATIONS - 1), operation_index + 1),
      operation,
    ], MAX_OPERATIONS - 1);
  }
  else {
    yield updateOperations([
      ...operations.slice(0, operation_index + 1),
      operation,
    ], operation_index + 1)
  }

  yield validate();
}

function* watchUndo() {
  while (true) {
    yield take('UNDO_OPERATION');
    const operations = yield getOperations();
    const operation_index = yield getOperationIndex();
    const operation = yield getCurrentOperation();
    console.log('undo', operation);
    if (operation) {
      switch (operation.type) {
        case 'Insert':
          yield undoInsert(operation);
          break;

        case 'Delete':
          yield undoDelete(operation);
          break;

        case 'Link':
          yield undoLink(operation);
          break;

        case 'Move':
          yield undoMove(operation);
          break;

        case 'DeleteBranchIndex':
          yield undoDeleteBranchIndex(operation);
          break;

        case 'AddBranchIndex':
          yield undoAddBranchIndex(operation);
          break;

        case 'Disconnect':
          yield undoDisconnect(operation);
          break;

        default:
          break;
      }

      yield updateOperations(operations, operation_index - 1);
      yield validate();
    }
  }
}

function* watchRedo() {
  while (true) {
    yield take('REDO_OPERATION');
    const operations = yield getOperations();
    const operation_index = yield getOperationIndex();
    const operation = yield getNextOperation();
    console.log('redo', operation);
    if (operation) {
      switch (operation.type) {
        case 'Insert':
          yield redoInsert(operation);
          break;

        case 'Delete':
          yield redoDelete(operation);
          break;

        case 'Link':
          yield redoLink(operation);
          break;

        case 'Move':
          yield redoMove(operation);
          break;

        case 'DeleteBranchIndex':
          yield redoDeleteBranchIndex(operation);
          break;

        case 'AddBranchIndex':
          yield redoAddBranchIndex(operation);
          break;

        case 'Disconnect':
          yield redoDisconnect(operation);
          break;

        default:
          break;
      }

      yield updateOperations(operations, operation_index + 1);
      yield validate();
    }
  }
}

function* undoInsert(operation) {
  const { parent_id, branch_index } = operation;
  const parent = yield getParagraph(parent_id);
  const child_id = getParagraphNextId(parent, branch_index);
  const child = yield getParagraph(child_id);
  const child_next_id = getParagraphNextId(child, 0);
  if (child) {
    yield deleteParagraph({ paragraph_id: child.id });
  }
  yield updateParagraph(setParagraphNextId(parent, branch_index, child_next_id));

  operation.child_paragraph = child;  // 注意，这个数据不需要显示，所以不进行解构
}

function* undoDelete(operation) {
  const { child_paragraph, parents } = operation;
  yield updateParagraph(child_paragraph);
  for (let i = 0, n = parents.length; i < n; i++) {
    const info = parents[i];
    const { paragraph_id: parent_id, branch_index } = info;
    const parent = yield getParagraph(parent_id);
    yield updateParagraph(setParagraphNextId(parent, branch_index, child_paragraph.id));
  }
}

function* undoLink(operation) {
  const { a } = operation;
  const paragraph = yield getParagraphWithNextIdUpdated(a.id, a.index, -1);
  yield updateParagraph(paragraph);
}

function* undoMove(operation) {
  yield moveParagraph({ from_parent: operation.to_parent, to_parent: operation.from_parent, child: operation.child });
}

function* undoDeleteBranchIndex(operation) {
  const { parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs } = operation;
  yield updateParagraph(...deleted_paragraphs);
  if (!deleted_item && parents.length > 0) {
    for (let i = 0, n = parents.length; i < n; ++i) {
      const parent = parents[i];
      yield updateParagraph(yield getParagraphWithNextIdUpdated(parent.paragraph_id, parent.branch_index, paragraph_id));
    }
  }
  else {
    const paragraph = yield getParagraph(paragraph_id);
    switch (paragraph.type) {
      case 'Branch':
        paragraph.selections.splice(branch_index, 0, deleted_item);
        yield updateParagraph({
          ...paragraph,
          selections: [...paragraph.selections],
        });
        break;
      case 'NumberBranch':
        paragraph.ranges.splice(branch_index, 0, deleted_item);
        yield updateParagraph({
          ...paragraph,
          ranges: [...paragraph.ranges],
        });
        break;
      default:
        break;
    }
  }
}

function* undoAddBranchIndex(operation) {
  const { paragraph_id } = operation;
  const paragraph = yield getParagraph(paragraph_id);
  switch (paragraph.type) {
    case 'Branch': {
      const { selections } = paragraph;
      const added_item = selections[selections.length - 1];
      yield updateParagraph({
        ...paragraph,
        selections: selections.slice(0, selections.length - 1),
      });

      operation.added_item = added_item;
      break;
    }


    case 'NumberBranch': {
      const { ranges } = paragraph;
      const added_item = ranges[ranges.length - 1];
      yield updateParagraph({
        ...paragraph,
        ranges: ranges.slice(0, ranges.length - 1),
      });

      operation.added_item = added_item;
      break;
    }

    default:
      break;
  }
}

function* undoDisconnect(operation) {
  const { paragraph_id, branch_index, next_id } = operation;
  yield updateParagraph(yield getParagraphWithNextIdUpdated(paragraph_id, branch_index, next_id));
}

function* redoInsert(operation) {
  const { parent_id, branch_index } = operation;
  const parent = yield getParagraph(parent_id);
  const { child_paragraph } = operation;
  const child_id = child_paragraph.id;
  yield updateParagraph(
    setParagraphNextId(parent, branch_index, child_id),
    child_paragraph
  );
}

function* redoDelete(operation) {
  const { child_paragraph } = operation;
  const child_id = child_paragraph.id;
  operation.child_paragraph = yield getParagraph(child_id);
  yield deleteParagraph({ paragraph_id: child_id });
}

function* redoLink(operation) {
  yield linkParagraphs({ a: operation.a, b: operation.b });
}

function* redoMove(operation) {
  yield moveParagraph({ from_parent: operation.from_parent, to_parent: operation.to_parent, child: operation.child });
}

function* redoDeleteBranchIndex(operation) {
  // {type: 'DeleteBranchIndex', parents, deleted_item, paragraph_id, branch_index, deleted_paragraphs};
  const result = yield deleteBranchIndex({ paragraph_id: operation.paragraph_id, branch_index: operation.branch_index });
  operation.deleted_item = result.deleted_item;
  operation.deleted_paragraphs = result.deleted_paragraphs;
}

function* redoAddBranchIndex(operation) {
  const { paragraph_id, added_item } = operation;
  const paragraph = yield getParagraph(paragraph_id);
  switch (paragraph.type) {
    case 'Branch':
      yield updateParagraph({
        ...paragraph,
        selections: [...paragraph.selections, added_item],
      });
      break;

    case 'NumberBranch':
      yield updateParagraph({
        ...paragraph,
        ranges: [...paragraph.ranges, added_item],
      });
      break;

    default:
      break;
  }
}

function* redoDisconnect(operation) {
  const { paragraph_id, branch_index } = operation;
  yield updateParagraph(yield getParagraphWithNextIdUpdated(paragraph_id, branch_index, -1));
}

function* updateOperations(operations, operation_index) {
  yield put({
    type: 'UPDATE_OPERATIONS',
    operations,
    operation_index,
  });
}

function* deleteParagraph(action) {
  const { paragraph_id: delete_id } = action;
  const paragraph = yield getParagraph(delete_id);
  const parents = [];
  if (yield isFirstParagraph(delete_id)) {
    yield setAppMessage('无法删除首个段落');
  }
  else {
    const paragraphs = yield getParagraphs();
    const next_id = paragraph.next_id;
    const updated_paragraphs = [];
    // 所有该段落的上一个段落，都将被修改next_id
    paragraphs.forEach(p => {
      if (p.id !== delete_id) {
        switch (p.type) {
          case 'Node':
          case 'Lock': {
            if (p.next_id === delete_id) {
              parents.push({ paragraph_id: p.id });
              updated_paragraphs.push({ ...p, next_id });
            }
            else {
              updated_paragraphs.push(p);
            }
            break;
          }

          case 'Branch': {
            updated_paragraphs.push({
              ...p,
              selections: p.selections.map((s, i) => {
                if (s.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...s, next_id };
                }
                else {
                  return s;
                }
              })
            });
            break;
          }

          case 'NumberBranch': {
            updated_paragraphs.push({
              ...p,
              ranges: p.ranges.map((r, i) => {
                if (r.next_id === delete_id) {
                  parents.push({ paragraph_id: p.id, branch_index: i });
                  return { ...r, next_id };
                }
                else {
                  return r;
                }
              })
            });
            break;
          }

          case 'End':
          default:
            updated_paragraphs.push(p);
        }
      }
    });

    yield updateProjectContent({
      ...yield getContent(),
      paragraphs: updated_paragraphs,
    });
  }

  return { type: 'Delete', child_paragraph: paragraph, parents, };
}

function* expandBranch(action) {
  const { paragraph_id } = action;
  yield updateParagraph({
    ...yield getParagraph(paragraph_id),
    expanded: action.expanded,
  });
}

function* insertNodeParagraph(action) {
  console.log('Insert node paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createNodeParagraph();
  child.chat_id = parent.chat_id;
  child.next_id = getParagraphNextId(parent, branch_index);
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* insertBranchParagraph(action) {
  console.log('Insert branch paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createBranchParagraph();
  child.selections[0].next_id = getParagraphNextId(parent, branch_index);
  child.chat_id = parent.chat_id;
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* insertEndParagraph(action) {
  console.log('Insert end paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createEndParagraph();
  child.chat_id = parent.chat_id;
  if (getParagraphNextId(parent, branch_index) === -1) {
    yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

    return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
  }
  else {
    yield setAppMessage('只允许在末尾添加结局');
  }
}

function* insertLockParagraph(action) {
  console.log('Insert lock paragraph');

  const { parent_id, branch_index } = action;
  const parent = yield getParagraph(parent_id);
  const child = yield createLockParagraph();
  child.next_id = getParagraphNextId(parent, branch_index);
  child.chat_id = parent.chat_id;
  yield updateParagraph(setParagraphNextId(parent, branch_index, child.id), child);

  return { type: 'Insert', parent_id, branch_index, child_paragraph: null };
}

function* totalcharacter() {
  let outline = yield getOntline();
  let paragraphs = yield getParagraphs();
  let character = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].type === 'End') {
      character += paragraphs[i].title.length;
      character += paragraphs[i].text.replace(/[\s]/g, '').replace(/(https?:\/\/)\w+(\.\w+)+.*\.[0-9a-zA-Z]+/g, '').length;
    } else if (paragraphs[i].type === 'Branch') {
      for (let j = 0; j < paragraphs[i].selections.length; j++) {
        character += paragraphs[i].selections[j].title.length;
      }
    } else if (paragraphs[i].type === 'Node') {
      // character += paragraphs[i].title.length;
      character += paragraphs[i].text.replace(/[\s]/g, '').replace(/(https?:\/\/)\w+(\.\w+)+.*\.[0-9a-zA-Z]+/g, '').length;
    }
  }
  outline.character_count = character;
  yield put({ type: 'UPDATE_PROJECT_OUTLINE', outline });
}

function* validate() {
  const content = yield getContent();
  const { errors, warnings } = validateProjectContent(content);
  yield put({
    type: 'UPDATE_VALIDATION_RESULT',
    errors,
    warnings,
  });
}

function* watchReviewProjectProject() {
  yield takeEvery('REVIEW_PROJECT', reviewProject);
}

export function* reviewProject(action) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在获取剧本数据...');
    const result = yield Api.fetch(config.url + '/v1/admin/reviewing_project/' + action.id, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const project = result.reviewing_project;
      const content = JSON.parse(project.content);
      if (!content.numbers) {
        content.numbers = [
          {
            id: 1,
            title: '好感度',
            number: 0,
          }
        ]
      }
      const outline = { ...project, content: '', script: '' }
      yield put({
        type: 'RESPONSE_PROJECT',
        outline,
        content,
      });
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'ProjectEditor-Editor-Review' });
    } else if (result.error === 1300) {
      yield setAppAlert('该剧本已在审核中,请在刷新列表后选择其他剧本！', { type: 'REQUEST_PROJECTS', status: 1 });
    } else {
      yield setAppMessage('获取剧本数据失败,请重新再试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchRequestProject() {
  yield takeEvery('REQUEST_PROJECT', requestProject);
}

export function* requestProject(action) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在获取剧本数据...');
    const result = yield Api.fetch(config.url + '/v1/admin/read_reviewing_project/' + action.id, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const project = result.reviewing_project;
      const content = JSON.parse(project.content);
      if (!content.numbers) {
        content.numbers = [
          {
            id: 1,
            title: '好感度',
            number: 0,
          }
        ]
      }
      const outline = { ...project, content: '', script: '' }
      yield put({
        type: 'RESPONSE_PROJECT',
        outline,
        content,
      });
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'ProjectEditor-Editor-Read' });
    } else {
      yield setAppMessage('获取剧本数据失败,请重新再试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* uploadFile(action) {
  try {
    yield setAppLoading('正在上传...');
    const upload = (file) => new Promise((resolve, reject) => {
      let Bucket = '';
      let Region = 'ap-shanghai';
      if (!file) {
        reject('请重新选择文件！');
      };
      let type = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      let name = uuid.create(4);
      if (type === '.jpg' || type === '.jpeg' || type === '.png' || type === '.gif') {
        if (action.filetype === 'video') {
          reject('文件格式不正确，视频仅支持.mp4文件格式！');
        } else {
          Bucket = 'image-1251001942';
          const createObjectURL = window.URL ? window.URL.createObjectURL : window.webkitURL.createObjectURL;
          let url = createObjectURL(file);
          var img = new Image();
          img.onload = () => {
            let info = '_' + img.width + '_' + img.height + '_' + RGBaster(img, ['0,0,0', '255,255,255']);
            name = name + info + type;
            // 上传文件
            config.cos.putObject({
              Bucket: Bucket,
              Region: Region,
              Key: '/script/' + name,
              Body: file,
            }, (err, data) => {
              if (err) {
                reject('文件上传出错，请确保网络正常后再试！');
              } else {
                resolve('http://image.putong.91smart.net/script/' + name);
              }
            });
          }
          img.src = url;
        }
      } else if (type === '.mp4') {
        if (action.filetype === 'img') {
          reject('文件格式不正确，图片支持.jpg、.jpeg、.gif、.png文件格式！');
        } else {
          Bucket = 'video-1251001942';
          const createObjectURL = window.URL ? window.URL.createObjectURL : window.webkitURL.createObjectURL;
          let url = createObjectURL(file);
          let video = document.createElement("video");
          video.onloadedmetadata = () => {
            let info = '_' + video.videoWidth + '_' + video.videoHeight + '_' + Math.round(video.duration);
            name = name + info + type;
            // 上传文件
            config.cos.putObject({
              Bucket: Bucket,
              Region: Region,
              Key: '/script/' + name,
              Body: file,
            }, (err, data) => {
              if (err) {
                reject('error');
              } else {
                resolve('http://video.putong.91smart.net/script/' + name);
              }
            });
          }
          video.src = url;
        }
      } else {
        reject('文件格式不正确，图片支持.jpg、.jpeg、.gif、.png等文件格式，视频仅支持.mp4格式！');
      }
    });
    const path = yield upload(action.file);
    action.callback(path);
  } catch (e) {
    yield setAppMessage(e);
  } finally {
    yield setAppLoading(null);
  }
}

function getLockParagraphs(content, game_id) {
  const { paragraphs } = content;
  const lock_paragraphs = [];
  paragraphs.forEach(p => {
    if (p.type === 'Lock') {
      lock_paragraphs.push({
        uuid: p.uuid,
        game_id,
        type: p.pay_type,
        diamond: p.diamond,
        coin: p.coin,
      });
    }
  });
  return lock_paragraphs
}

function* onlineProject(action) {
  try {
    const outline = yield getOntline();
    const token = yield getToken();
    yield setAppLoading('正在上架剧本...');
    const result = yield Api.fetch(config.url + '/v1/admin/commit', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ id: outline.id, update_time: outline.update_time })
    });
    if (result.error === 0) {
      yield setAppMessage('剧本上架成功！');
    } else {
      yield setAppMessage('上架失败,请重新尝试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* signProject(action) {
  try {
    const outline = yield getOntline();
    const token = yield getToken();
    yield setAppLoading('正在上架剧本...');
    const result = yield Api.fetch(config.url + '/v1/admin/sign_project/' + outline.id, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      yield setAppMessage('剧本签约成功！');
    } else {
      yield setAppMessage('签约失败,请重新尝试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* outlineProject(action) {
  try {
    const outline = yield getOntline();
    const token = yield getToken();
    yield setAppLoading('正在上架剧本...');
    const result = yield Api.fetch(config.url + '/v1/admin/uncommit', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ id: outline.id, update_time: outline.update_time })
    });
    if (result.error === 0) {
      yield setAppMessage('剧本下架成功！');
    } else {
      yield setAppMessage('下架失败,请重新尝试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* notpassProject(action) {
  try {
    const outline = yield getOntline();
    const token = yield getToken();
    yield setAppLoading('正在处理审核...');
    const result = yield Api.fetch(config.url + '/v1/admin/send_back', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ id: outline.id, update_time: outline.update_time })
    });
    if (result.error === 0) {
      yield setAppMessage('审核完成，已通知作者作品审核不通过！');
    } else {
      yield setAppMessage('审核失败,请重新尝试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* passProject(action) {
  try {
    const outline = yield getOntline();
    const token = yield getToken();
    yield setAppLoading('正在处理审核...');
    const result = yield Api.fetch(config.url + '/v1/admin/pass', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ id: outline.id, update_time: outline.update_time })
    });
    if (result.error === 0) {
      yield setAppMessage('审核完成，已通知作者作品审核通过！');
    } else {
      yield setAppMessage('审核失败,请重新尝试！');
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppMessage('未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* saveProject(action) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在保存剧本...');
    const outline = yield getOntline();
    const content = yield getContent();
    const project = { ...outline, content: JSON.stringify(content) };
    const result = yield Api.fetch(config.url + '/v1/project/', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify(project)
    });
    if (result.error === 0) {
      yield setAppMessage('保存了【' + project.title + '】的剧本内容！');
      return true;
    } else {
      yield setAppMessage('剧本保存失败,请重新尝试！');
      console.log('发生了未知错误！');
      return false;
    }
  }
  catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络异常，请检查网络后重试！');
          break;
        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息失效，请重新登录！', { type: 'LOGOUT' });
          break;
        case AppErrorCode.ResponseStatusError:
          yield setAppMessage('保存剧本失败，请检查网络后重试');
          break;
        default:
          throw e;
      }
    } else {
      yield setAppMessage('未知错误，请刷新页面后重新尝试！');
    }
    return false;
  }
  finally {
    yield setAppLoading(null);
  }
}

function* watchUploadFile() {
  yield takeEvery('UPLOAD_FILE', uploadFile);
}

function* watchPostActions() {
  yield takeEvery('SIGN_PROJECT', signProject);
  yield takeEvery('ONLINE_PROJECT', onlineProject);
  yield takeEvery('OUTLINE_PROJECT', outlineProject);
  yield takeEvery('NOTPASS_PROJECT', notpassProject);
  yield takeEvery('PASS_PROJECT', passProject);
  yield takeEvery('SAVE_PROJECT', saveProject);
}

function* watchUpdateParagraph() {
  yield takeEvery('UPDATE_PARAGRAPH', function* (action) {
    yield updateParagraph({ ...action.paragraph });
  });
}

function* watchForValidation() {
  while (true) {
    yield take(['RESPONSE_PROJECT', 'UPDATE_PROJECT_CONTENT', 'UPDATE_PARAGRAPH']);
    yield totalcharacter();
    yield validate();
  }
}

function getParagraphNextId(paragraph, branch_index) {
  switch (paragraph.type) {
    case 'Branch':
      return paragraph.selections[branch_index].next_id;

    case 'NumberBranch':
      return paragraph.ranges[branch_index].next_id;

    default:
      return paragraph.next_id;
  }
}

function setParagraphNextId(paragraph, branch_index, next_id) {
  switch (paragraph.type) {
    case 'Branch':
      return {
        ...paragraph,
        selections: paragraph.selections.map((s, i) => i === branch_index ? { ...s, next_id } : s),
      };

    case 'NumberBranch':
      return {
        ...paragraph,
        ranges: paragraph.ranges.map((r, i) => i === branch_index ? { ...r, next_id } : r),
      };

    default:
      return {
        ...paragraph,
        next_id,
      };
  }
}

function* getParagraphWithNextIdUpdated(paragraph_id, branch_index, next_id) {
  const paragraph = yield getParagraph(paragraph_id);
  return setParagraphNextId(paragraph, branch_index, next_id);
}

function* getParagraphTreeScale() {
  return yield select(store => store.editor.paragraph_tree_scale);
}

export default function* editor() {
  yield fork(watchRequestProject);
  yield fork(watchOperations);
  yield fork(watchUndo);
  yield fork(watchRedo);
  yield fork(watchUploadFile);
  yield fork(watchPostActions);
  yield fork(watchUpdateParagraph);
  yield fork(watchForValidation);
  yield fork(watchReviewProjectProject);
};