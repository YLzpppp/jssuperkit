import React from 'react';
import { View } from 'react-native';

const StatusView = (props:{
    children?:any;
    show?:boolean;
}) => {

    if(props.show){
        return props?.children;
    }else{
        //TODO: add error,loading ...etc status

        return null;
    }
};

export default StatusView;