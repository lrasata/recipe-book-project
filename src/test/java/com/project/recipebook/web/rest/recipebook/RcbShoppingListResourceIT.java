package com.project.recipebook.web.rest.recipebook;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.project.recipebook.IntegrationTest;
import com.project.recipebook.domain.Ingredient;
import com.project.recipebook.domain.ShoppingList;
import com.project.recipebook.domain.enumeration.ShoppingStatus;
import com.project.recipebook.repository.IngredientRepository;
import com.project.recipebook.repository.ShoppingListRepository;
import com.project.recipebook.web.rest.TestUtil;

import java.util.ArrayList;
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
    private static final Long DEFAULT_AMOUNT = (long) 1;

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Mock
    private ShoppingListRepository shoppingListRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShoppingListMockMvc;

    private ShoppingList shoppingList;

    public static Ingredient createIngredientEntity(EntityManager em) {
        Ingredient ingredient = new Ingredient().name(DEFAULT_TITLE).amount(DEFAULT_AMOUNT);
        return ingredient;
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
        Ingredient ingredient = createIngredientEntity(em);
        ingredientRepository.saveAndFlush(ingredient);
        shoppingList = createEntity(em);
        shoppingList.addIngredient(ingredient);
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
    void createShoppingListShouldAddIngredientInExistingDraftShoppingList() throws Exception {
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
        assertThat(testShoppingListIngredientAmount.getIngredients()).isNotEmpty();

        // As Ingredient is the same, should increase the amount of Ingredient 
        Ingredient[] ingredients = (Ingredient[]) testShoppingListIngredientAmount.getIngredients().toArray();
        assertThat(ingredients[0].getAmount()).isEqualTo(DEFAULT_AMOUNT*2);
    }

    @Test
    @Transactional
    void createShoppingListShouldAddAnotherIngredientInExistingDraftShoppingList() throws Exception {
        Ingredient ingredient2 = createIngredientEntity(em);
        ingredientRepository.saveAndFlush(ingredient2);
        
        shoppingList.addIngredient(ingredient2);

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
        assertThat(testShoppingListIngredientAmount.getIngredients().size()).isEqualTo(2);
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
            .andExpect(jsonPath("$.[*].ingredients").isNotEmpty());
    }
    
}