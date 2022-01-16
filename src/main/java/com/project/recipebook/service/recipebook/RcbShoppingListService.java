package com.project.recipebook.service.recipebook;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.project.recipebook.domain.Ingredient;
import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.domain.enumeration.ShoppingStatus;
import com.project.recipebook.repository.recipebook.RcbShoppingListRepository;
import com.project.recipebook.web.rest.errors.BadRequestAlertException;
import com.project.recipebook.web.rest.errors.TooManyShoppingListDraftException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing custom shopping List
 */
@Service
@Transactional
public class RcbShoppingListService {
    private final RcbShoppingListRepository rcbShoppingListRepository;

    private static final String ENTITY_NAME = "rcbshoppinglist";
    
    public RcbShoppingListService(
        RcbShoppingListRepository rcbShoppingListRepository
    ){
        this.rcbShoppingListRepository = rcbShoppingListRepository;
    }

    public ShoppingList create(ShoppingList shoppingList) throws URISyntaxException, TooManyShoppingListDraftException  {
        if (shoppingList.getUser().getId() == null) {
            throw new BadRequestAlertException("A new shoppingList must have User ", ENTITY_NAME,"usermustexist");
        }
        List<ShoppingList> existingShoppingListByUser = this.rcbShoppingListRepository
            .findAllDraftWithEagerRelationshipsUserLogin(shoppingList.getUser().getLogin());
        if (existingShoppingListByUser.isEmpty()) {
            return this.rcbShoppingListRepository.save(shoppingList);
        } else if (existingShoppingListByUser.size() > 1) {
            throw new TooManyShoppingListDraftException();
        } else {
            ShoppingList newShoppingList = merge2ShoppingListAndIncrementIngredients(existingShoppingListByUser.get(0), shoppingList);
            newShoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
            return this.rcbShoppingListRepository.save(newShoppingList);
        }

    }

    public ShoppingList merge2ShoppingListAndIncrementIngredients(ShoppingList existingShoppingList, ShoppingList newShoppingList) {
        Iterator<Ingredient> itr = newShoppingList.getIngredients().iterator(); 
        Set<Ingredient> hashSet = existingShoppingList.getIngredients();
        List<Ingredient> existingIngredients = new ArrayList<>(hashSet);
        
        while(itr.hasNext()){ 
            int index = getIndexIngredientInShoppingList(itr.next(), existingShoppingList);
            if (index != -1) {
                Ingredient ingredientToUpdate  = existingIngredients.get(index) ;
                Long initialAmount = ingredientToUpdate.getAmount();
                Long amountToAdd = itr.next().getAmount();
                existingIngredients.get(index).setAmount(initialAmount + amountToAdd);
            } else {
                existingIngredients.add(itr.next());
            }
        }
        existingShoppingList.setIngredients( new HashSet<>(existingIngredients));
         return existingShoppingList;

    }

    public int getIndexIngredientInShoppingList(Ingredient i, ShoppingList shoppingList) {
        List<Ingredient> existingIngredients = new ArrayList<>(shoppingList.getIngredients());
        
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
