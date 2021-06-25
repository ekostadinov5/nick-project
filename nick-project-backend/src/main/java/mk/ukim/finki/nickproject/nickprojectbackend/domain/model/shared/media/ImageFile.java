package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "image_file")
@Getter
public class ImageFile extends AbstractEntity<ImageFileId> {

    @Column(name = "filename", nullable = false)
    private String filename;

    protected ImageFile() {
    }

    public ImageFile(String filename) {
        super(DomainObjectId.randomId(ImageFileId.class));

        this.filename = filename;
    }

}
