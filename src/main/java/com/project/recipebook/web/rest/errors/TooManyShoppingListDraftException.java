package com.project.recipebook.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class TooManyShoppingListDraftException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    public TooManyShoppingListDraftException() {
        super(ErrorConstants.DEFAULT_TYPE, "Too many Draft ShoppingList detected.", Status.BAD_REQUEST);
    }
}
