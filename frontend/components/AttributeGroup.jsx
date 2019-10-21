import React from 'react';
import FilterGroupContainer from './FilterGroupContainer';

export default function AttributeGroup(props) {
  return (
    <section className="ProductFilters__Group" key={props.attributeName}>
      <li className={props.attributeFilters ? "ProductFilters__Text_type_activeTitle" : "ProductFilters__Text_type_title"}>
        <h3>{props.attributeName}</h3>
        <svg xmlns="http://www.w3.org/2000/svg" height='7' width='10'>
          <path d='M5.057 3.566L7.974.649l1.414 1.414-4.243 4.243-.088-.089-.084.085L.73 2.06 2.141.65l2.916 2.916z' fillRule='evenodd' fill='23666' />
        </svg>
      </li>
      <ul className="ProductFilters__List">
        <section className="ProductFilters__Header">
          <p>{props.attributefiltersActiveCount} selected</p>
        </section>
        <FilterGroupContainer
          attributeName={props.attributeName}
          attributeId={props.attributeId}
          currentFilters={props.currentFilters}
        />
      </ul>
    </section>
  );
}