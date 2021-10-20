/* globals jspdf */
/* exported SVGTemplate SVG */

function SVGTemplate(file) {

    let
        template;

    this.load = (cb) => {
        const xmlhttp = new XMLHttpRequest();
        if (cb)
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4)
                    if ((xmlhttp.status == 200) || (xmlhttp.status == 0)) {
                        template = xmlhttp.responseText;
                        cb();
                    }
                else cb();
            };
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    }

    this.getSVG = () => template;

}

function SVG(template) {

    const
        SIZEMAP={
            circle:{
                width:"r",
                height:"r",
                x:"cx",
                y:"cy"
            },
            default:{
                width:"width",
                height:"height",
                x:"x",
                y:"y"
            }
        },
        SIZEMUL={
            circle:{
                width:2,
                height:2
            }
        },
        node = document.createElement("div");

    let
        pdfCache=0,
        pdfQueue=[];

    node.innerHTML = template.getSVG();

    this.get = (node,attr) => {
        return node.getAttribute((SIZEMAP[node.tagName]||SIZEMAP.default)[attr]);
    }

    this.getNum = (node,attr) => {
        return (this.get(node,attr)*1)*(SIZEMUL[node.tagName]&&SIZEMUL[node.tagName][attr]?SIZEMUL[node.tagName][attr]:1);
    }

    this.setNum = (node,attr,value) => {
        return this.set(node,attr,value/(SIZEMUL[node.tagName]&&SIZEMUL[node.tagName][attr]?SIZEMUL[node.tagName][attr]:1));
    }

    this.set = (node,attr,value) => {
        return node.setAttribute((SIZEMAP[node.tagName]||SIZEMAP.default)[attr],value);
    }

    this.createNode = (type) => document.createElementNS("http://www.w3.org/2000/svg", type);

    this.setClassName = (node,className) => node.setAttribute("class",className);

    this.cloneNodeBy = (id,newid,x,y,w,h) => {
        let org;
        if (typeof id == "string") org=this.getById(id);
        else org=id;
        const copy=this.copyNode(org);
        if (newid) this.setId(copy,newid);
        this.moveNodeAt(copy,this.getNum(org,"x")+x,this.getNum(org,"y")+y);
        if (w!==undefined) this.resizeNode(copy,w,h);
        this.insertBefore(org,copy);
        return copy;
    }

    this.copyNode = (node) => {
        const copy = this.createNode(node.tagName);
        ["x","y","width","height","style","cx","cy","r","d","class","transform"].forEach(attr=>{
            if (node.getAttribute(attr)) copy.setAttribute(attr,node.getAttribute(attr));
        });       
        copy.innerHTML=node.innerHTML;
        return copy;
    }

    this.moveNodeAt = (node,x,y) => {
        const
            orgx=this.getNum(node,"x"),
            orgy=this.getNum(node,"y"),
            dx=x-orgx,
            dy=y-orgy;
        this.setNum(node,"x",x);
        this.setNum(node,"y",y);
        [
            node.querySelectorAll("tspan"),
            node.querySelectorAll("rect"),
            node.querySelectorAll("circle")
        ].forEach(nodes=>{
            for (let i=0;i<nodes.length;i++) {
                this.setNum(nodes[i],"x",this.getNum(nodes[i],"x")+dx);
                this.setNum(nodes[i],"y",this.getNum(nodes[i],"y")+dy);     
            }
        });
    }

    this.resizeNode = (node,width,height) => {
        this.setNum(node,"width",width);
        this.setNum(node,"height",height);
    }

    this.insertBefore = (node, node2) => node.parentNode.insertBefore(node2, node);

    this.getById = (id,subnode) => (subnode||node).querySelector("#" + id);

    this.setId = (node,id) => node.id=id;

    this.setImage = (id, image) => this.getById(id).setAttribute("xlink:href", image);

    this.delete = (node) => {
        node.parentNode.removeChild(node);
    }

    this.deleteById = (id) => {
        let subnode = this.getById(id);
        if (!subnode) subnode = node.querySelector("[inkscape\\:label=\"" + id + "\"]");
        if (subnode) this.delete(subnode);
    }

    this.setAttributeNumber = (node, prop, value) => {
        value = Math.floor(value * 1000) / 1000;
        node.setAttribute(prop, value);
    }

    this.setText = (subnode, text) => {
        const
            LH = 3.1,
            lines = ("" + text).split("\n"),
            tspan = subnode.querySelector("tspan"),
            style = tspan.getAttribute("style"),
            x = this.getNum(tspan,"x");
        let y = this.getNum(tspan,"y");
        y -= (LH * (lines.length - 1)) / 2;
        subnode.innerHTML = "";
        lines.forEach(line => {
            const span = this.createNode("tspan");
            this.setAttributeNumber(span, "x", x);
            this.setAttributeNumber(span, "y", y);
            span.setAttribute("style", style);
            span.innerHTML = line;
            subnode.appendChild(span);
            y += LH;
        })

    }

    this.assignDownloadToAnchor = (a,mimetype,data,filename) => {
        const blob = new Blob([data], {
            type: mimetype
        });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
    }

    this.assignPDFDownloadToAnchor = (a,filename) => {
        this.getPDF((data)=>{
            this.assignDownloadToAnchor(a,"application/pdf",data,filename);
        })
    }

     this.assignSVGDownloadToAnchor = (a,filename) => {
        this.assignDownloadToAnchor(a,"image/svg+xml",this.getSVG(),filename);
    }

    this.download = (filename) => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        this.assignSVGDownloadToAnchor(a,filename);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    this.getSVG = () => node.innerHTML;

    this.getPDF = (cb) => {

        if (pdfQueue.length) pdfQueue.push(cb);
        else {

            if (pdfCache) cb(pdfCache);
            else {

                pdfQueue.push(cb);

                const svgElement = node.firstElementChild;
                svgElement.getBoundingClientRect();

                const doc = new jspdf.jsPDF({
                    orientation: 'l',
                    unit: 'mm'
                });
                doc
                    .svg(svgElement)
                    .then(() => {
                        pdfCache=doc.output('arraybuffer');
                        pdfQueue.forEach(cb=>cb(pdfCache));
                        pdfQueue=[];
                    })

            }

        }

    }

}
