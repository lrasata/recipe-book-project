package com.project.recipebook.web.rest.recipebook;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.project.recipebook.IntegrationTest;
import com.project.recipebook.domain.Ingredient;
import com.project.recipebook.domain.IngredientOrder;
import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.domain.enumeration.ShoppingStatus;
import com.project.recipebook.repository.IngredientOrderRepository;
import com.project.recipebook.repository.IngredientRepository;
import com.project.recipebook.repository.ShoppingListRepository;
import com.project.recipebook.web.rest.TestUtil;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
/**
 * Integration tests for the {@link RcbShoppingListResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RcbShoppingListResourceIT {
    private static final ShoppingStatus DEFAULT_SHOPPING_STATUS = ShoppingStatus.DRAFT;
    private static final ShoppingStatus UPDATED_SHOPPING_STATUS = ShoppingStatus.ORDERED;

    private static final String ENTITY_API_URL = "/api/rcb/shopping-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String DEFAULT_TITLE = "DEFAULT_TITLE";
    private static final String DEFAULT_INGREDIENT_NAME = "DEFAULT_NAME";
    private static final Long DEFAULT_AMOUNT = (long) 1;

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private IngredientOrderRepository ingredientOrderRepository;

    @Mock
    private ShoppingListRepository shoppingListRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShoppingListMockMvc;

    private ShoppingList shoppingList;

    public static Ingredient createIngredientEntity(EntityManager em) {
        Ingredient ingredient = new Ingredient().amount(DEFAULT_AMOUNT);
        ingredient.setName(DEFAULT_INGREDIENT_NAME);
        return ingredient;
    }

    public static IngredientOrder createIngredientOrderEntity(EntityManager em) {
        IngredientOrder ingredientOrder = new IngredientOrder().amountOrder(DEFAULT_AMOUNT);
        return ingredientOrder;
    }
    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShoppingList createEntity(EntityManager em) {
        ShoppingList shoppingList = new ShoppingList().shoppingStatus(DEFAULT_SHOPPING_STATUS);
        return shoppingList;
    }

    @BeforeEach
    public void initTest() {
        Ingredient ingredient =  createIngredientEntity(em);
        ingredient = ingredientRepository.saveAndFlush(ingredient);

        IngredientOrder ingredientOrder = createIngredientOrderEntity(em);
        ingredientOrder.setIngredient(ingredient);
        ingredientOrderRepository.saveAndFlush(ingredientOrder);

        shoppingList = createEntity(em);
        shoppingList.addIngredientOrder(ingredientOrder);
    }

    @Test
    @Transactional
    void createFirstShoppingList() throws Exception {
        int databaseSizeBeforeCreate = shoppingListRepository.findAll().size();
        // Create the ShoppingList
        restShoppingListMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isCreated());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeCreate + 1);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(DEFAULT_SHOPPING_STATUS);
    }

    @Test
    @Transactional
    void createShoppingListShouldUpdateIngredientOrderInExistingDraftShoppingList() throws Exception {
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeCreate = shoppingListRepository.findAll().size();
        // Create the ShoppingList
        restShoppingListMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isCreated());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeCreate + 1);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(DEFAULT_SHOPPING_STATUS);
        ShoppingList testShoppingListIngredientAmount = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingListIngredientAmount.getIngredientOrders()).isNotEmpty();

        // As Ingredient is the same, should increase the amount of Ingredient 
        IngredientOrder[] ingredientOrders = (IngredientOrder[]) testShoppingListIngredientAmount.getIngredientOrders().toArray();
        assertThat(ingredientOrders[0].getIngredient().getName()).isEqualTo(DEFAULT_INGREDIENT_NAME);
    }

    @Test
    @Transactional
    void createShouldAddAnotherShoppingListAsFirstOneIsOrdered() throws Exception {
        shoppingList.setShoppingStatus(ShoppingStatus.ORDERED);
        shoppingListRepository.saveAndFlush(shoppingList);

        shoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
        int databaseSizeBeforeCreate = shoppingListRepository.findAll().size();
        // Create the ShoppingList
        restShoppingListMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isCreated());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeCreate + 1);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(DEFAULT_SHOPPING_STATUS);
        ShoppingList testShoppingListIngredientAmount = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingListIngredientAmount.getIngredientOrders()).isNotEmpty();

    }

    @Test
    @Transactional
    void createShoppingListShouldAddAnotherIngredientInExistingDraftShoppingList() throws Exception {
        Ingredient ingredient2 = createIngredientEntity(em);
        ingredient2 = ingredientRepository.saveAndFlush(ingredient2);

        IngredientOrder ingredientOrder2 = createIngredientOrderEntity(em);
        ingredientOrder2.setIngredient(ingredient2);
        ingredientOrder2 = ingredientOrderRepository.saveAndFlush(ingredientOrder2);
        
        shoppingList.addIngredientOrder(ingredientOrder2);

        int databaseSizeBeforeCreate = shoppingListRepository.findAll().size();
        // Create the ShoppingList
        restShoppingListMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shoppingList)))
            .andExpect(status().isCreated());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeCreate + 1);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(DEFAULT_SHOPPING_STATUS);
        ShoppingList testShoppingListIngredientAmount = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingListIngredientAmount.getIngredientOrders().size()).isEqualTo(2);
    }

    @Test
    @Transactional
    void updateNewShoppingList() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList
        ShoppingList updatedShoppingList = shoppingListRepository.findById(shoppingList.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingList are not directly saved in db
        em.detach(updatedShoppingList);
        updatedShoppingList.shoppingStatus(UPDATED_SHOPPING_STATUS);

        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShoppingList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(UPDATED_SHOPPING_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shoppingList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void updateWithIdMismatchShoppingList() throws Exception {
        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();
        shoppingList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putOrderedShoppingListStayOrdered() throws Exception {
        // Initialize the database
        shoppingList.setShoppingStatus(ShoppingStatus.ORDERED);
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList
        ShoppingList updatedShoppingList = shoppingListRepository.findById(shoppingList.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingList are not directly saved in db
        em.detach(updatedShoppingList);
        updatedShoppingList.shoppingStatus(ShoppingStatus.DRAFT);

        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShoppingList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(ShoppingStatus.ORDERED);
    }

    @Test
    @Transactional
    void putDraftShoppingListStayToOrdered() throws Exception {
        // Initialize the database
        shoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList
        ShoppingList updatedShoppingList = shoppingListRepository.findById(shoppingList.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingList are not directly saved in db
        em.detach(updatedShoppingList);
        updatedShoppingList.shoppingStatus(ShoppingStatus.ORDERED);

        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShoppingList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(ShoppingStatus.ORDERED);
    }

    @Test
    @Transactional
    void orderShoppingList() throws Exception {
        // Initialize the database
        shoppingList.setShoppingStatus(ShoppingStatus.DRAFT);
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList
        ShoppingList updatedShoppingList = shoppingListRepository.findById(shoppingList.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingList are not directly saved in db
        em.detach(updatedShoppingList);
        updatedShoppingList.shoppingStatus(ShoppingStatus.ORDERED);

        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShoppingList.getId(), "order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShoppingList))
            )
            .andExpect(status().isOk());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
        ShoppingList testShoppingList = shoppingListList.get(shoppingListList.size() - 1);
        assertThat(testShoppingList.getShoppingStatus()).isEqualTo(ShoppingStatus.ORDERED);
    }

    @Test
    @Transactional
    void orderShoppingListMustContainListOfIngredients() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        int databaseSizeBeforeUpdate = shoppingListRepository.findAll().size();

        // Update the shoppingList
        ShoppingList updatedShoppingList = shoppingListRepository.findById(shoppingList.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingList are not directly saved in db
        em.detach(updatedShoppingList);
        updatedShoppingList.setIngredientOrders(new HashSet<IngredientOrder>());

        restShoppingListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShoppingList.getId(), "order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShoppingList))
            )
            .andExpect(status().isBadRequest());

        // Validate the ShoppingList in the database
        List<ShoppingList> shoppingListList = shoppingListRepository.findAll();
        assertThat(shoppingListList).hasSize(databaseSizeBeforeUpdate);
    }


    @Test
    @Transactional
    void getAllShoppingLists() throws Exception {
        // Initialize the database
        shoppingListRepository.saveAndFlush(shoppingList);

        // Get all the shoppingListList
        restShoppingListMockMvc
            .perform(get(ENTITY_API_URL))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shoppingList.getId().intValue())))
            .andExpect(jsonPath("$.[*].shoppingStatus").value(hasItem(DEFAULT_SHOPPING_STATUS.toString())))
            .andExpect(jsonPath("$.[*].ingredientOrders").isNotEmpty());
    }
    
}
