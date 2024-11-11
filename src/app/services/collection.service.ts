import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class CollectionService {
    mainCollectionUUID = 'uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a';
    collectionStructure = [];

    private collectionStructureSubject = new BehaviorSubject<any>(null); // Default null
    collectionStructure$ = this.collectionStructureSubject.asObservable(); // Public observable

    constructor(private apiService: ApiService) { }

    // Observable pro hover události z mapy do menu
    private hoverFromMapSubject = new Subject<string | null>();
    hoverFromMap$ = this.hoverFromMapSubject.asObservable();

    // Observable pro hover události z menu do mapy
    private hoverFromMenuSubject = new Subject<string | null>();
    hoverFromMenu$ = this.hoverFromMenuSubject.asObservable();

    // Emitování hover událostí z mapy
    emitHoverFromMap(areaName: string | null) {
        this.hoverFromMapSubject.next(areaName);
    }

    // Emitování hover událostí z menu
    emitHoverFromMenu(areaName: string | null) {
        this.hoverFromMenuSubject.next(areaName);
    }

    init(params?: any) {
        if (!this.collectionStructure.length) {
            this.loadCollectionStructure();
        }
    }

    loadCollectionStructure() {
        this.getCollectionStructure(this.mainCollectionUUID).subscribe((data: any) => {
            this.collectionStructureSubject.next(data); // Update the subject with new data
          });
    }

    reload(params: any) {
        // reload collection
    }

    getCollection(pid: string): Observable<Object> {
        return this.apiService.getCollection(pid);
    }
    getCollectionChildren(pid: string): Observable<Object> {
        return this.apiService.getCollectionChildren(pid);
    }
    getCollectionStructure(pid: string): Observable<any> {
        console.log('getCollectionStructure:', pid);
        return this.getCollectionChildren(pid).pipe(
            switchMap((data: any) => {
                let collectionData = data['response']['docs'];
    
                // Definice typu pro položku kolekce
                let collectionStructure$: Observable<any>[] = collectionData.map((item: any) => {
                    let collectionItem = {
                        pid: item['pid'],
                        title: item['title.search'] ? item['title.search'] : '',
                        model: item['model'] || '',
                        children: [] as any[]
                    };
    
                    // Načtení první úrovně dětí (druhá úroveň stromu)
                    return this.getCollectionChildren(item['pid']).pipe(
                        switchMap((childrenData: any) => {
                            let children: Observable<any>[] = childrenData['response']['docs'].map((child: any) => {
                                let childItem = {
                                    pid: child['pid'],
                                    title: child['title.search'] ? child['title.search'] : '',
                                    model: child['model'] || '',
                                    children: [] as any[]
                                };
    
                                // Načtení druhé úrovně dětí (třetí úroveň stromu)
                                return this.getCollectionChildren(child['pid']).pipe(
                                    map((grandChildrenData: any) => {
                                        childItem.children = grandChildrenData['response']['docs'].map((grandChild: any) => ({
                                            pid: grandChild['pid'],
                                            title: grandChild['title.search'] ? grandChild['title.search'] : '',
                                            model: grandChild['model'] || ''
                                        }));
                                        return childItem;
                                    })
                                );
                            });
    
                            // Sloučení všech observables pro children na této úrovni
                            return forkJoin(children).pipe(
                                map((resolvedChildren) => {
                                    collectionItem.children = resolvedChildren;
                                    return collectionItem;
                                })
                            );
                        })
                    );
                });
    
                // Sloučení všech observables pro hlavní kolekci a její děti
                return forkJoin(collectionStructure$);
            })
        );
    }    
}