import React from 'react';
import { connect } from 'react-redux';
import resume from '../pdf/resume.pdf';
import '../css/pages.css';


class Resume extends React.Component {

    render() {
        return (
            <div className="resume">
                <h5>PDF renderer is temporarily down</h5>
                <p><a href={resume}>Click Here</a> To load the PDF</p>
                {/*
            <Document file={resume} onLoadSuccess={this.onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>
            {numPages != null &&
                <p>Page {pageNumber} of {numPages}</p>
            }
            */}
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedResume = connect(mapState, actionCreators)(Resume);
export { connectedResume as Resume };