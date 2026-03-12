type Props = {
    label : string;
    classNameLabel?: string
    value : string;
    classNameValue?: string
    classNameBox?: string
}

export default function BoxInternalInfo ({label, classNameLabel, value, classNameValue, classNameBox } : Props) {
    return   <div 
    className={`bg-slate-600 p-2 rounded-lg w-fit ${classNameBox}`}>
            <label className={`text-md leading-tight ${classNameLabel}`}>{label}</label>
            <label className={`text-lg font-bold ${classNameValue}`}>{value}</label>
          </div>
}