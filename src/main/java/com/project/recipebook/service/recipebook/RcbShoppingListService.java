package com.project.recipebook.service.recipebook;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.project.recipebook.domain.Ingredient;
import com.project.recipebook.domain.IngredientOrder;
import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.domain.enumeration.ShoppingStatus;
import com.project.recipebook.repository.recipebook.RcbShoppingListRepository;
import com.project.recipebook.service.recipebook.error.TooManyShoppingListDraftException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing custom shopping List
 */
@Service
@Transactional
public class RcbShoppingListService {
    private final Logger log = LoggerFactory.getLogger(RcbShoppingListService.class);

    private final RcbShoppingListRepository rcbShoppingListRepository;

    private static final String ENTITY_NAME = "rcbshoppinglist";
    
    public RcbShoppingListService(
        RcbShoppingListRepository rcbShoppingListRepository
    ){
        this.rcbShoppingListRepository = rcbShoppingListRepository;
    }

    public ShoppingList create(ShoppingList shoppingList) throws TooManyShoppingListDraftException{
        List<ShoppingList> existingShoppingListByUser = this.rcbShoppingListRepository
            .findAllDraftWithEagerRelationshipsUserLogin(shoppingList.getUser().getLogin());
        if (existingShoppingListByUser.isEmpty()) {
            shoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
            return this.rcbShoppingListRepository.save(shoppingList);
        } else if (existingShoppingListByUser.size() > 1) {
            throw new TooManyShoppingListDraftException();
        } else {
            ShoppingList newShoppingList = merge2ShoppingListAndIncrementIngredientOrders(existingShoppingListByUser.get(0), shoppingList);
            newShoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
            return this.rcbShoppingListRepository.save(newShoppingList);
        }

    }

    public ShoppingList merge2ShoppingListAndIncrementIngredientOrders(ShoppingList existingShoppingList, ShoppingList newShoppingList) {

        Set<IngredientOrder> newhashSet = newShoppingList.getIngredientOrders();
        List<IngredientOrder> newIngredients = new ArrayList<>(newhashSet);

        Set<IngredientOrder> hashSet = existingShoppingList.getIngredientOrders();
        List<IngredientOrder> existingIngredients = new ArrayList<>(hashSet);

        for (IngredientOrder i : newIngredients) {
            int index = getIndexIngredientOrderInShoppingList(i, existingShoppingList);
            
            if (index != -1) {
                IngredientOrder ingredientToUpdate  = existingIngredients.get(index) ;
                Long initialAmount = ingredientToUpdate.getAmountOrder();
                Long amountToAdd = i.getAmountOrder();
                existingIngredients.get(index).setAmountOrder(initialAmount + amountToAdd);
            } else {
                existingIngredients.add(i);
            }
        } 

        
        existingShoppingList.setIngredientOrders( new HashSet<>(existingIngredients));
         return existingShoppingList;

    }

    public int getIndexIngredientOrderInShoppingList(IngredientOrder i, ShoppingList shoppingList) {
        List<IngredientOrder> existingIngredients = new ArrayList<>(shoppingList.getIngredientOrders());
        
        for(int index = 0; index < existingIngredients.size(); index++) {
            if (i.getId().equals(existingIngredients.get(index).getId())) {
                return index;
            }
        }
        return -1;
    }

    public ShoppingStatus getCorrectStatus (ShoppingStatus initialStatus, ShoppingStatus newStatus){
        if (initialStatus.equals(ShoppingStatus.DRAFT) && newStatus.equals(ShoppingStatus.ORDERED)) {
            return ShoppingStatus.ORDERED;
        } else if (initialStatus.equals(ShoppingStatus.ORDERED) && newStatus.equals(ShoppingStatus.DRAFT)) {
            return ShoppingStatus.ORDERED;
        } else if (initialStatus.equals(ShoppingStatus.ORDERED) && newStatus.equals(ShoppingStatus.ORDERED)) {
            return ShoppingStatus.ORDERED;
        } else {
            return ShoppingStatus.DRAFT;
        }
    }
    
}
