package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class CommentId extends DomainObjectId {

    public CommentId() {
        super(DomainObjectId.randomId(CommentId.class).getId());
    }

    public CommentId(String id) {
        super(id);
    }

}
