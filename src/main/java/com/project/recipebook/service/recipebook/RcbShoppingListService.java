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
import com.project.recipebook.repository.IngredientOrderRepository;
import com.project.recipebook.repository.recipebook.RcbIngredientOrderRepository;
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

    private final RcbIngredientOrderRepository ingredientOrderRepository;

    private static final String ENTITY_NAME = "rcbshoppinglist";
    
    public RcbShoppingListService(
        RcbShoppingListRepository rcbShoppingListRepository,
        RcbIngredientOrderRepository ingredientOrderRepository
    ){
        this.rcbShoppingListRepository = rcbShoppingListRepository;
        this.ingredientOrderRepository = ingredientOrderRepository;
    }

    public ShoppingList create(ShoppingList shoppingList) throws TooManyShoppingListDraftException{
        List<ShoppingList> existingDraftShoppingListByUser = this.rcbShoppingListRepository
            .findAllWithEagerRelationshipsDraftByUserLogin(shoppingList.getUser().getLogin());


        if (existingDraftShoppingListByUser.isEmpty()) {
            shoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
            this.saveIngredientOrdersFromNewShoppingList(shoppingList);
            return this.rcbShoppingListRepository.save(shoppingList);
        
        } else if (existingDraftShoppingListByUser.size() > 1) {
            throw new TooManyShoppingListDraftException();
        
        } else {
            ShoppingList newShoppingList = mergeIngredientOrdersOfTwoShoppingLists(existingDraftShoppingListByUser.get(0), shoppingList);
            shoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
            this.saveIngredientOrdersFromNewShoppingList(newShoppingList);
            return this.rcbShoppingListRepository.save(newShoppingList);
        }

    }

    public void saveIngredientOrdersFromNewShoppingList(ShoppingList shoppingList) {
        List<IngredientOrder> ingredientOrders = new ArrayList<>(shoppingList.getIngredientOrders());
        
        for (IngredientOrder ingredientOrder: ingredientOrders) {
            this.ingredientOrderRepository.save(ingredientOrder);
        }
    }

    public ShoppingList update(ShoppingList newShoppingList) {
        ShoppingList existingShoppingList = this.rcbShoppingListRepository.findById(newShoppingList.getId()).get();

        ShoppingList result = mergeIngredientOrdersOfTwoShoppingLists(existingShoppingList, newShoppingList);

        result.setShoppingStatus(getCorrectStatus(
            existingShoppingList.getShoppingStatus(), 
                    newShoppingList.getShoppingStatus()
            )
        );
        this.saveIngredientOrdersFromNewShoppingList(result);

        return this.rcbShoppingListRepository.save(result);
    }

    public ShoppingList order(ShoppingList newShoppingList) {
        ShoppingList existingShoppingList = this.rcbShoppingListRepository.findById(newShoppingList.getId()).get();

        ShoppingList result = mergeIngredientOrdersOfTwoShoppingLists(existingShoppingList, newShoppingList);

        result.setShoppingStatus(ShoppingStatus.ORDERED);
        this.saveIngredientOrdersFromNewShoppingList(result);

        return this.rcbShoppingListRepository.save(result);
    }

    public ShoppingList mergeIngredientOrdersOfTwoShoppingLists(ShoppingList existingShoppingList, ShoppingList newShoppingList) {
        List<IngredientOrder> newIngredientOrders = new ArrayList<>(newShoppingList.getIngredientOrders());

        List<IngredientOrder> existingIngredientOrders = new ArrayList<>(existingShoppingList.getIngredientOrders());

        for (IngredientOrder iOrder : newIngredientOrders) {
            int index = getIndexIngredientOrderInShoppingList(iOrder, existingShoppingList);
            
            if (index != -1) {
                IngredientOrder ingredientOrderToUpdate  = existingIngredientOrders.get(index) ;
                Long initialAmount = ingredientOrderToUpdate.getAmountOrder();
                Long amountToAdd = iOrder.getAmountOrder();
                Long totalAmountOrder = initialAmount + amountToAdd;
                
                existingIngredientOrders.get(index).setAmountOrder(totalAmountOrder);
                   
            } else {
                existingIngredientOrders.add(iOrder);
            }
        } 

        
        existingShoppingList.setIngredientOrders( new HashSet<>(existingIngredientOrders));
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

    public List<ShoppingList> findAllByUserAndShoppingStatus(String userLogin, ShoppingStatus shoppingStatus) {
        List<ShoppingList> list = new ArrayList<ShoppingList>();
        switch(shoppingStatus.name()) {
            case "DRAFT":
                list = this.rcbShoppingListRepository.findAllWithEagerRelationshipsDraftByUserLogin(
                    userLogin);
                break;
            case "ORDERED":
                list = this.rcbShoppingListRepository.findAllWithEagerRelationshipsOrderedByUserLogin(
                    userLogin);
                break;
        }

        return list;
    }
    
}
