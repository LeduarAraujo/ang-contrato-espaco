import { Component } from '@angular/core';
import { Navbar } from "./navbar/navbar";
import { Footer } from "./footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet , Navbar, Footer],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss'
})
export class DefaultLayout {

}
