import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
wishlistItems: any[] = [];

  constructor( private wishlistService:WishlistService) { }

  ngOnInit() {
    this.wishlistService.getWishlistItems();
    this.wishlistService.wishlistProducts$.subscribe((items: any[]) => {
      this.wishlistItems = items;
    })
    
    // Fetch the wishlist items.
  }

}
