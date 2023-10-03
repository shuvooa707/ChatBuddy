<?php

User::whereHas("posts", function($query){
    $query->where("id", ">", "23");
})->get();