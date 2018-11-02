import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports:[
        CommonModule,
        HttpClientModule
    ]    
})
export class PagedListModule{

    constructor(private _injector: Injector){
        PagedListModule.injector = _injector;
    }

    static injector: Injector = null;       
}