/*
& - className
&& - parentClassName


1.1
var cls = classify.init(this/props, 'className'); // args oreder doesn't matter
<div className={cls('& &&_aaa bbb -arg0', {arg1: true, arg2: flase, arg3: null})}>
=> 'className parentClassName_abc bbb -arg0 -arg1 -arg3-null'
<div className={cls()}>
=> 'className parentClassName'
<div className={cls({arg: a})}>
=> 'className parentClassName -arg-a'

1.2.
var cls = classify.init(this/props); 
<div className={cls('abc &_el1 &&_el2', {arg: 1})}>
=> 'parentClassName abc &_el1 parentClassName_el2 -arg-1'
<div className={cls()}>
=> 'parentClassName'
<div className={cls({arg: a})}>
=> 'parentClassName -arg-a'

1.3
var cls = classify.init('className'); 
<div className={cls('abc &_el &&_el', {arg: 1})}>
=> 'className abc className_el1 &&_el -arg-1'
<div className={cls()}>
=> 'className'
<div className={cls({arg: a})}>
=> 'className -arg-a'

2.
var className = classify.objInit(this/props, 'className');  // args oreder doesn't matter
<div {...className('abc &_el')>

3.
<div className={classify('abc &_el', {arg: 1}) }>  // args oreder doesn't matter
=> 'abc &_el -arg-1'
*/

export default function classify(...args) {
  let { classStr, modifiers } = parseClassArgs(args);
  return joinClass(classStr, modifiers)
}

classify.init = (...args) => {
  const { className, parentClassName } = parseInitArgs(args);
  return (...args) => {
    let res;
    if (args.length) {
      let { classStr, modifiers } = parseClassArgs(args, className, parentClassName);
      if (!classStr) {
        res = joinClass(className, parentClassName, modifiers);
      } else {
        res = joinClass(classStr, modifiers)
      }
    } else {
      res = joinClass(className, parentClassName);
    }
    return res;
  }
}


classify.objInit = (...args) => {
  const { className, parentClassName } = parseInitArgs(args);
  return (...args) => {
    let res;
    if (args.length) {
      let { classStr, modifiers } = parseClassArgs(args, className, parentClassName);
      if (!classStr) {
        res = joinClass(className, parentClassName, modifiers);
      } else {
        res = joinClass(classStr, modifiers)
      }
    } else {
      res = joinClass(className, parentClassName);
    }
    return { className: res };
  }
}

function parseInitArgs(args) {
  var className = '', parentClassName = '';
  for (let arg of args) {
    if (typeof arg == 'object') {
      parentClassName = arg.props ? arg.props.className : arg.className || '';
    } else {
      className = arg;
    }
  }
  return { className, parentClassName };
}

function parseClassArgs(args, className=null, parentClassName=null) {
  var classStr = '', modifiers = '';
  for (let arg of args) {
    if (typeof arg == 'object') {
      modifiers = prepareModifiersStr(arg);
    } else {
      classStr = prepareClassStr(arg, className, parentClassName);
    }
  }
  return { classStr, modifiers };
}

function prepareClassStr(classStr, className, parentClassName) {
  return classStr.replace(
    /(&{1,2})/g,
    match => (match == '&&') ? (parentClassName || '&&') : (className || '&')
  );
}

export function prepareModifiersStr(modifiers) {
  let resStr = '';
	for (let modName in modifiers) {
		let modVal = modifiers[modName];
		if (modVal === false) continue;
		let modClass = ' -' + modName;
		if (modVal !== true) modClass += '-' + modVal;
		resStr += modClass;
  }
	return resStr;
}

export function joinClass(...args) { //TODO добавить проверку на null undefined
  return args.filter(s => !/^\s*$/.test(s)).join(' ');
}
