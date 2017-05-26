import { Injectable } from '@angular/core';

import { Project } from './project';
import { PROJECTS } from '../../../assets/mock/projects';

@Injectable()
export class ProjectService {
  getProjects(): Promise<Project[]> {
    return Promise.resolve(PROJECTS);
  }

  getProject(key: string): Promise<Project> {
    return this.getProjects().then(o => o.find(p => p.key === key));
  }
}

// import { Injectable }    from '@angular/core';
// import { Headers, Http } from '@angular/http';

// import 'rxjs/add/operator/toPromise';

// import { Project } from './project';

// @Injectable()
// export class HeroService {

//   private headers = new Headers({'Content-Type': 'application/json'});
//   private projectsUrl = 'api/projects';  // URL to web api

//   constructor(private http: Http) { }

//   getProjects(): Promise<Project[]> {
//     return this.http.get(this.projectsUrl)
//       .toPromise()
//       .then(response => response.json().data as Project[])
//       .catch(this.handleError);
//   }

//   getHero(id: number): Promise<Hero> {
//     const url = `${this.projectsUrl}/${id}`;
//     return this.http.get(url)
//       .toPromise()
//       .then(response => response.json().data as Hero)
//       .catch(this.handleError);
//   }

//   delete(id: number): Promise<void> {
//     const url = `${this.projectsUrl}/${id}`;
//     return this.http.delete(url, {headers: this.headers})
//       .toPromise()
//       .then(() => null)
//       .catch(this.handleError);
//   }

//   create(name: string): Promise<Hero> {
//     return this.http
//       .post(this.projectsUrl, JSON.stringify({name: name}), {headers: this.headers})
//       .toPromise()
//       .then(res => res.json().data as Hero)
//       .catch(this.handleError);
//   }

//   update(hero: Hero): Promise<Hero> {
//     const url = `${this.projectsUrl}/${hero.id}`;
//     return this.http
//       .put(url, JSON.stringify(hero), {headers: this.headers})
//       .toPromise()
//       .then(() => hero)
//       .catch(this.handleError);
//   }

//   private handleError(error: any): Promise<any> {
//     console.error('An error occurred', error); // for demo purposes only
//     return Promise.reject(error.message || error);
//   }
// }

