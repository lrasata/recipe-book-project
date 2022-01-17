package com.project.recipebook.web.rest.recipebook;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.domain.enumeration.ShoppingStatus;
import com.project.recipebook.repository.recipebook.RcbShoppingListRepository;
import com.project.recipebook.service.recipebook.RcbShoppingListService;
import com.project.recipebook.web.rest.errors.BadRequestAlertException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.testcontainers.shaded.org.awaitility.reflect.exception.TooManyFieldsFoundException;

import tech.jhipster.web.util.HeaderUtil;

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
    private final RcbShoppingListService rcbShoppingListService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public RcbShoppingListResource(
        RcbShoppingListRepository shoppingListRepository,
        RcbShoppingListService rcbShoppingListService) {
        this.shoppingListRepository = shoppingListRepository;
        this.rcbShoppingListService = rcbShoppingListService;
    }

        /**
     * {@code POST  /shopping-lists} : Create a new shoppingList.
     *
     * @param shoppingList the shoppingList to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shoppingList, or with status {@code 400 (Bad Request)} if the shoppingList has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shopping-lists")
    public ResponseEntity<ShoppingList> createShoppingList(@Valid @RequestBody ShoppingList shoppingList) throws URISyntaxException {
        log.debug("REST request to save ShoppingList : {}", shoppingList);
        if (shoppingList.getId() != null) {
            throw new BadRequestAlertException("A new shoppingList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (shoppingList.getUser().getId() == null) {
            throw new BadRequestAlertException("A new shoppingList must have User ", ENTITY_NAME,"usermustexist");
        }
        ShoppingList result = this.rcbShoppingListService.create(shoppingList);
        return ResponseEntity
            .created(new URI("/api/rcb/shopping-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

        /**
     * {@code PUT  /shopping-lists/:id} : Updates an existing shoppingList.
     *
     * @param id the id of the shoppingList to save.
     * @param shoppingList the shoppingList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shoppingList,
     * or with status {@code 400 (Bad Request)} if the shoppingList is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shoppingList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shopping-lists/{id}")
    public ResponseEntity<ShoppingList> updateShoppingList(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ShoppingList shoppingList
    ) throws URISyntaxException {
        log.debug("REST request to update ShoppingList : {}, {}", id, shoppingList);
        if (shoppingList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shoppingList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shoppingListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        shoppingList.setShoppingStatus(this.rcbShoppingListService.getCorrectStatus(
            shoppingListRepository.getById(
                    shoppingList.getId()).getShoppingStatus(), 
                    shoppingList.getShoppingStatus()
            )
        );
        ShoppingList result = shoppingListRepository.save(shoppingList);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shoppingList.getId().toString()))
            .body(result);
    }

            /**
     * {@code PUT  /shopping-lists/:id} : Updates an existing shoppingList.
     *
     * @param id the id of the shoppingList to save.
     * @param shoppingList the shoppingList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shoppingList,
     * or with status {@code 400 (Bad Request)} if the shoppingList is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shoppingList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shopping-lists/{id}/order")
    public ResponseEntity<ShoppingList> orderShoppingList(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ShoppingList shoppingList
    ) throws URISyntaxException {
        log.debug("REST request to update ShoppingList : {}, {}", id, shoppingList);
        if (shoppingList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shoppingList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shoppingListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        shoppingList.setShoppingStatus(ShoppingStatus.ORDERED);
        ShoppingList result = shoppingListRepository.save(shoppingList);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shoppingList.getId().toString()))
            .body(result);
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

        /**
     * {@code GET  /user/{userLogin}/shopping-lists} : get all the shopping-lists by userLogin.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shopping-lists in body.
     */
    @GetMapping("/user/{userLogin}/shopping-lists/{status}")
    public ResponseEntity<List<ShoppingList>> getAllShoppingListByStatusByUserLogin(
        @PathVariable("userLogin") String userLogin,
        @PathVariable("status") ShoppingStatus status) {
        log.debug("REST request to get a list of Shopping List by UserLogin by status : "+ status.name());
        
        List<ShoppingList> shoppingLists = new ArrayList<ShoppingList>();
        switch(status.name()) {
            case "DRAFT":
                shoppingLists= this.shoppingListRepository.findAllDraftWithEagerRelationshipsUserLogin(userLogin);
                return ResponseEntity.ok().body(shoppingLists);
            case "ORDERED":
                shoppingLists= this.shoppingListRepository.findAllOrderedtWithEagerRelationshipsUserLogin(userLogin);
                return ResponseEntity.ok().body(shoppingLists);
            default:
            return ResponseEntity.ok().body(shoppingLists);

        }

        
    }
    
}