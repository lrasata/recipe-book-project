package com.project.recipebook.web.rest.recipebook;

import java.util.List;

import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.repository.ShoppingListRepository;
import com.project.recipebook.repository.recipebook.RcbShoppingListRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST controller for managing {@link com.project.recipebook.domain.ShoppingList}.
 */
@RestController
@RequestMapping("/api/rcb")
@Transactional
public class RcbShoppingListResource {
    private final Logger log = LoggerFactory.getLogger(RcbShoppingListResource.class);

    private static final String ENTITY_NAME = "rcbshoppinglist";
    private final RcbShoppingListRepository shoppingListRepository;

    public RcbShoppingListResource(RcbShoppingListRepository shoppingListRepository) {
        this.shoppingListRepository = shoppingListRepository;
    }

    /**
     * {@code GET  /shopping-lists} : get all the shopping-lists.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopping-lists in body.
     */
    @GetMapping("/shopping-lists")
    public ResponseEntity<List<ShoppingList>> getAllShoppingList() {
        log.debug("REST request to get a list of Shopping List");
        List<ShoppingList> shoppingLists= this.shoppingListRepository.findAllWithEagerRelationships();

        return ResponseEntity.ok().body(shoppingLists);
    }

        /**
     * {@code GET  /user/{userLogin}/shopping-lists} : get all the shopping-lists by userLogin.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopping-lists in body.
     */
    @GetMapping("/user/{userLogin}/shopping-lists")
    public ResponseEntity<List<ShoppingList>> getAllShoppingListByUserLogin(@PathVariable("userLogin") String userLogin) {
        log.debug("REST request to get a list of Shopping List by UserLogin ");
        List<ShoppingList> shoppingLists= this.shoppingListRepository.findAllWithEagerRelationshipsByUserLogin(userLogin);

        return ResponseEntity.ok().body(shoppingLists);
    }
    
}