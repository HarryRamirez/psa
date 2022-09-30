import { Component, OnInit } from "@angular/core";
import { environment } from "@environments/environment";

@Component({
  selector: "app-body",
  templateUrl: "./body.component.html",
  styleUrls: ["./body.component.scss"],
})
export class BodyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  redirectLogin() {
    window.location.href = `${environment.appUrl}ingresar`;
  }
}
