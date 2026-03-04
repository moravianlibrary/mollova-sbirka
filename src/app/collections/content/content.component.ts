import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { EnvironmentService } from '../../services/environment.service';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
})
export class ContentComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    @Input() pid!: string | null;
    loading: boolean = false;
    children: any[] = [];
    collection: any = {};
    map: any = {};
    siblings: any[] = [];
    typeOfResource: string = '';
    currentLang: string = '';

    apiThumbUrl =
        this.envService.get('krameriusBaseUrl') + '/api/client/v7.0/items/';

    collectionStructure: any[] = [];
    collectionIndex: any = {};

    constructor(
        private envService: EnvironmentService,
        private collectionService: CollectionService,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.currentLang = this.translate.currentLang || 'cs';
        this.translate.onLangChange.subscribe((event) => {
            this.currentLang = event.lang;
        });

        this.loading = true;
        this.children = [];

        // Předplatné na collectionStructure$
        const collectionStructureSub =
            this.collectionService.collectionStructure$.subscribe(
                (collectionStructure) => {
                    this.collectionStructure = collectionStructure;
                },
            );
        this.subscription.add(collectionStructureSub);

        // Předplatné na collectionIndex$
        // const collectionIndexSub = this.collectionService.collectionIndex$.subscribe((collectionIndex) => {
        const collectionIndexSub = this.collectionService
            .getCollectionIndexFromJSON()
            .subscribe((collectionIndex) => {
                this.collectionIndex = collectionIndex;
            });
        this.subscription.add(collectionIndexSub);

        // Předplatné na context$
        const contextSub = this.collectionService.context$.subscribe(
            (context) => {
                this.pid = context;
                this.loadCollection(context);
            },
        );
        this.subscription.add(contextSub);

        // Předplatné na siblings$
        const siblingsSub = this.collectionService.siblings$.subscribe(
            (siblings) => {
                this.siblings = siblings;
            },
        );
        this.subscription.add(siblingsSub);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadCollection(pid: string | null): void {
        if (!pid) {
            console.error('No PID provided');
            this.loading = false;
            return;
        }

        this.children = [];
        this.loading = true;
        this.collectionService.getCollection(pid).subscribe((data: any) => {
            if (
                data &&
                data['response'] &&
                data['response']['docs'] &&
                data['response']['docs'][0]
            ) {
                let item = data['response']['docs'][0];

                // KOLEKCE NEBO MAPA

                // KOLEKCE

                if (item.model === 'collection') {
                    this.typeOfResource = 'collection';
                    this.collection = data['response']['docs'][0];
                    this.collectionService
                        .getChildrenByPidWithDetails(pid)
                        .subscribe((children) => {
                            // POTOMCI JSOU KOLEKCE
                            console.log('children:', children);
                            this.children = children;
                            if (children.length === 0) {
                                // POTOMCI JSOU MAPY
                                this.collectionService
                                    .getCollectionChildren(pid)
                                    .subscribe((data: any) => {
                                        if (data) {
                                            const children = data;
                                            this.children = children.sort(
                                                (a: any, b: any) => {
                                                    return a[
                                                        'shelf_locators'
                                                    ][0].localeCompare(
                                                        b['shelf_locators'][0],
                                                    );
                                                },
                                            );
                                        } else {
                                            console.error(
                                                'Invalid data format:',
                                                data,
                                            );
                                        }
                                        this.loading = false;
                                    });
                            } else {
                                this.loading = false;
                            }
                        });
                } else {
                    // MAPA
                    this.map = null;
                    setTimeout(() => (this.map = data['response']['docs'][0]));

                    this.typeOfResource = 'map';
                    this.map = data['response']['docs'][0];
                    console.log('MAP:', this.map);

                    let directCollectionPid = this.getProperPid(
                        this.map['in_collections.direct'],
                    );

                    if (directCollectionPid) {
                        this.collectionService
                            .getCollectionChildren(directCollectionPid)
                            .subscribe((data) => {
                                // console.log('Children3:', data);
                                this.loading = false;
                            });
                        this.collectionService
                            .getCollection(directCollectionPid)
                            .subscribe((data: any) => {
                                if (
                                    data &&
                                    data['response'] &&
                                    data['response']['docs'] &&
                                    data['response']['docs'][0]
                                ) {
                                    this.collection =
                                        data['response']['docs'][0];
                                } else {
                                }
                            });
                        this.collectionService
                            .getElasticDetailsToMap(this.map['pid'])
                            .subscribe((data: any) => {
                                // console.log('Elastic details:', data, this.map['pid']);
                                let elasticDetails =
                                    data['hits']['hits'][0]['_source'];
                                this.map.elasticDetails = elasticDetails;
                            });
                    } else {
                        // console.error('No direct collection PID found for map:', this.map['pid']);
                        setTimeout(() => {
                            this.collectionService
                                .getCollectionChildren(directCollectionPid)
                                .subscribe((data) => {
                                    // console.log('Children3:', data);
                                    this.children = data;
                                    this.loading = false; // možná přesunout níž podle situace
                                });
                            this.collectionService
                                .getCollection(directCollectionPid)
                                .subscribe((data: any) => {
                                    if (
                                        data &&
                                        data['response'] &&
                                        data['response']['docs'] &&
                                        data['response']['docs'][0]
                                    ) {
                                        this.collection =
                                            data['response']['docs'][0];
                                    } else {
                                        console.error(
                                            'Invalid data format:',
                                            data,
                                        );
                                    }
                                });

                            this.collectionService
                                .getElasticDetailsToMap(this.map['pid'])
                                .subscribe((data: any) => {
                                    // console.log('Elastic details:', data, this.map['pid']);
                                    let elasticDetails =
                                        data['hits']['hits'][0]['_source'];
                                    this.map.elasticDetails = elasticDetails;
                                });
                        }, 100); // čas v milisekundách, např. 100–300ms
                    }
                }
            } else {
                console.error('Invalid data format:', data);
            }
        });
    }

    checkMollsCollectionInPid(pid: any): boolean {
        return false;
    }

    onCardClick(item: any): void {
        // console.log('Card clicked:', item);
        this.router.navigate(['/mollova-sbirka', item.pid]);
    }

    getTitle(): string {
        if (this.currentLang === 'en') {
            return this.collection['title.search_eng'];
        } else if (this.currentLang === 'de') {
            return this.collection['title.search_ger'];
        }
        return this.collection['title.search_cze'];
    }
    getDescription(): string {
        if (this.currentLang === 'en') {
            return this.collection['collection.desc_eng'];
        } else if (this.currentLang === 'de') {
            return this.collection['collection.desc_ger'];
        }
        return this.collection['collection.desc_cze'];
    }
    getChildrenTitle(item: any): any {
        if (item.model === 'collection') {
            if (this.currentLang === 'en') {
                return item.collectionDetails['title.search_eng'];
            } else if (this.currentLang === 'de') {
                return item.collectionDetails['title.search_ger'];
            }
            return item.collectionDetails['title.search_cze'];
        } else {
            return item['title.search'] || item['title'];
        }
    }
    getChildrenDescription(item: any): any {
        if (item.model === 'collection') {
            if (this.currentLang === 'en') {
                return item.collectionDetails['collection.desc_eng'];
            } else if (this.currentLang === 'de') {
                return item.collectionDetails['collection.desc_ger'];
            }
            return item.collectionDetails['collection.desc_cze'];
        } else {
            if (item.authors && item.authors.length > 0) {
                return item['authors'].join(', ');
            } else if (item['date.str']) {
                if (item['date.str'].endsWith(']')) {
                    return item['date.str'].substring(
                        0,
                        item['date.str'].length - 1,
                    );
                } else {
                    return item['date.str'];
                }
            } else {
                return '';
            }
        }
    }
    getChildrenImage(item: any): string {
        // https://api.kramerius.mzk.cz/search/api/client/v7.0/items/uuid:a70963b4-753d-401a-ac98-21040ee6508a/image/thumb
        return `${this.apiThumbUrl}${item.pid}/image/thumb`;
    }
    getProperPid(pids: string[]): string {
        if (pids && pids.length === 1) {
            return pids[0];
        } else if (pids && pids.length > 1) {
            for (let pid of pids) {
                if (this.collectionIndex[pid]) {
                    return pid;
                }
            }
        }
        return '';
    }
}
