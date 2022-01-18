package com.project.recipebook.service.recipebook.error;

import com.project.recipebook.web.rest.errors.ErrorConstants;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class TooManyShoppingListDraftException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    public TooManyShoppingListDraftException() {
        super(ErrorConstants.DEFAULT_TYPE, "Too many Draft ShoppingList detected.", Status.BAD_REQUEST);
    }
}
