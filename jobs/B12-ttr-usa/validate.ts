/** Pure validator for the schema keywords used by this job; audited against Draft2020-12. */
export interface Schema {readonly $ref?:string;readonly type?:string;readonly const?:unknown;readonly enum?:readonly unknown[];readonly properties?:Readonly<Record<string,Schema>>;readonly required?:readonly string[];readonly additionalProperties?:boolean;readonly items?:Schema;readonly minItems?:number;readonly maxItems?:number;readonly uniqueItems?:boolean;readonly minLength?:number;readonly pattern?:string;readonly minimum?:number;readonly maximum?:number;readonly $defs?:Readonly<Record<string,Schema>>}
export function validate(value:unknown,schema:Schema,root:Schema=schema,path='$'):readonly string[]{
 const errors:string[]=[];let rule=schema;
 if(rule.$ref){if(!rule.$ref.startsWith('#/$defs/'))throw new RangeError('Unsupported external ref');const target=root.$defs?.[rule.$ref.slice(8)];if(!target)throw new RangeError('Unknown schema ref');rule=target;}
 if(Object.hasOwn(rule,'const')&&JSON.stringify(value)!==JSON.stringify(rule.const))errors.push(path+': const');
 if(rule.enum&&!rule.enum.some(v=>JSON.stringify(v)===JSON.stringify(value)))errors.push(path+': enum');
 const object=typeof value==='object'&&value!==null&&!Array.isArray(value);
 const validType=rule.type===undefined||rule.type==='object'&&object||rule.type==='array'&&Array.isArray(value)||rule.type==='string'&&typeof value==='string'||rule.type==='integer'&&typeof value==='number'&&Number.isInteger(value)||rule.type==='number'&&typeof value==='number'&&Number.isFinite(value)||rule.type==='boolean'&&typeof value==='boolean'||rule.type==='null'&&value===null;
 if(!validType)return[...errors,path+': type'];
 if(typeof value==='string'){if(rule.minLength!==undefined&&[...value].length<rule.minLength)errors.push(path+': minLength');if(rule.pattern&&!new RegExp(rule.pattern).test(value))errors.push(path+': pattern');}
 if(typeof value==='number'){if(rule.minimum!==undefined&&value<rule.minimum)errors.push(path+': minimum');if(rule.maximum!==undefined&&value>rule.maximum)errors.push(path+': maximum');}
 if(Array.isArray(value)){if(rule.minItems!==undefined&&value.length<rule.minItems)errors.push(path+': minItems');if(rule.maxItems!==undefined&&value.length>rule.maxItems)errors.push(path+': maxItems');if(rule.uniqueItems&&new Set(value.map(v=>JSON.stringify(v))).size!==value.length)errors.push(path+': uniqueItems');if(rule.items)for(let i=0;i<value.length;i++)errors.push(...validate(value[i],rule.items,root,path+'['+i+']'));}
 if(object){const values=value as Record<string,unknown>;for(const key of rule.required??[])if(!Object.hasOwn(values,key))errors.push(path+'.'+key+': required');for(const key of Object.keys(values)){const child=rule.properties?.[key];if(child)errors.push(...validate(values[key],child,root,path+'.'+key));else if(rule.additionalProperties===false)errors.push(path+'.'+key+': additionalProperties');}}
 return errors;
}
