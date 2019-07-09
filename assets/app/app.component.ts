import {Component} from '@angular/core';
const styles = (theme: ThemeVariables) => ({
  '@global': {
    body: { // Styles for `<body>` element
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {


}
