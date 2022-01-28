package com.project.recipebook.web.rest.recipebook;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.project.recipebook.IntegrationTest;
import com.project.recipebook.RecipebookApp;
import com.project.recipebook.domain.Ingredient;
import com.project.recipebook.domain.Recipe;
import com.project.recipebook.repository.IngredientRepository;
import com.project.recipebook.repository.RecipeRepository;
import com.project.recipebook.web.rest.TestUtil;
import com.project.recipebook.web.rest.errors.ExceptionTranslator;
import com.project.recipebook.web.rest.recipebook.RcbRecipeResource;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;

import org.aspectj.lang.annotation.Before;
import org.junit.Ignore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RcbRecipeResourceTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_PATH = "BBBBBBBBBB";

    private static final Long DEFAULT_AMOUNT = (long) 1;

    private static final String ENTITY_API_URL = "/api/rcb/recipes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Mock
    private RecipeRepository recipeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRecipeMockMvc;

    private Recipe recipe;

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
    public static Recipe createEntity(EntityManager em) {
        Recipe recipe = new Recipe()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .imagePath(DEFAULT_IMAGE_PATH);
        recipe.setIngredients(new HashSet<Ingredient>());
        return recipe;
    }

    @BeforeEach
    public void initTest() {
        Ingredient ingredient = createIngredientEntity(em);
        Ingredient i = ingredientRepository.saveAndFlush(ingredient);
        recipe = createEntity(em);
        recipe.addIngredient(ingredientRepository.findById(i.getId()).get());
    }

    @Test
    @Transactional
    void getAllRecipes() throws Exception {
        // Initialize the database

        recipeRepository.saveAndFlush(recipe);

        // Get all the recipeList
        restRecipeMockMvc
            .perform(get(ENTITY_API_URL))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].imagePath").value(hasItem(DEFAULT_IMAGE_PATH)))
            .andExpect(jsonPath("$.[*].ingredients").isNotEmpty());
    }
    
}
