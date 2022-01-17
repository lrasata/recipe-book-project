package com.project.recipebook.repository.recipebook;

import java.util.List;

import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.repository.ShoppingListRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RcbShoppingListRepository extends ShoppingListRepository {
    @Query("select distinct shoppingList " + 
    "from ShoppingList shoppingList left join fetch shoppingList.ingredients " + 
    "where shoppingList.user.login =:userLogin")
    List<ShoppingList> findAllWithEagerRelationshipsByUserLogin(@Param("userLogin") String userLogin );

    @Query("select distinct shoppingList " + 
    "from ShoppingList shoppingList left join fetch shoppingList.ingredients " + 
    "where shoppingList.user.login =:userLogin and shoppingList.shoppingStatus like 'DRAFT'")
    List<ShoppingList> findAllDraftWithEagerRelationshipsUserLogin(
        @Param("userLogin") String userLogin);
    
    @Query("select distinct shoppingList " + 
    "from ShoppingList shoppingList left join fetch shoppingList.ingredients " + 
    "where shoppingList.user.login =:userLogin and shoppingList.shoppingStatus like 'ORDERED'")
    List<ShoppingList> findAllOrderedtWithEagerRelationshipsUserLogin(
        @Param("userLogin") String userLogin);
}
